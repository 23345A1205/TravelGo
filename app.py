from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travelgo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<User {self.name}>'

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    travel_date = db.Column(db.Date, nullable=False)
    passengers = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='confirmed')
    
    def __repr__(self):
        return f'<Booking {self.destination}>'

# Routes
@app.route('/')
def home():
    """Home page with featured destinations"""
    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login page"""
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['user_name'] = user.name
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid email or password!', 'error')
    
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration page"""
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            flash('Email already registered!', 'error')
            return render_template('register.html')
        
        # Check if passwords match
        if password != confirm_password:
            flash('Passwords do not match!', 'error')
            return render_template('register.html')
        
        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(name=name, email=email, password=hashed_password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful! Please login.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            flash('Registration failed! Please try again.', 'error')
    
    return render_template('register.html')

@app.route('/logout')
def logout():
    """User logout"""
    session.clear()
    flash('You have been logged out!', 'info')
    return redirect(url_for('home'))

@app.route('/booking', methods=['GET', 'POST'])
def booking():
    """Booking page for travel tickets"""
    if 'user_id' not in session:
        flash('Please login to make a booking!', 'error')
        return redirect(url_for('login'))
    
    if request.method == 'POST':
        category = request.form.get('category', 'train')
        origin = request.form.get('origin')
        destination = request.form['destination']
        travel_date = request.form['travel_date']
        # For hotel bookings, passengers are not required; default to 1
        passengers = int(request.form['passengers']) if category != 'hotel' and request.form.get('passengers') else 1
        hotel_name = request.form.get('hotel_name') if category == 'hotel' else None
        
        # Calculate price in INR based on category (per person)
        base_prices = {
            'train': 500,
            'bus': 300,
            'flight': 2000,
            'hotel': 1500
        }
        base_price = base_prices.get(category, 500)
        total_price = base_price * passengers
        
        # Create booking
        new_booking = Booking(
            user_id=session['user_id'],
            destination=f"{origin} → {destination}{' - ' + hotel_name if hotel_name else ''}",
            travel_date=datetime.strptime(travel_date, '%Y-%m-%d').date(),
            passengers=passengers,
            total_price=total_price
        )
        
        try:
            db.session.add(new_booking)
            db.session.commit()
            # Redirect to payment page with booking id
            return redirect(url_for('payment', booking_id=new_booking.id))
        except Exception as e:
            flash('Booking failed! Please try again.', 'error')
    
    return render_template('booking.html')

@app.route('/payment', methods=['GET', 'POST'])
def payment():
    if 'user_id' not in session:
        flash('Please login to continue!', 'error')
        return redirect(url_for('login'))

    booking_id = request.args.get('booking_id') or request.form.get('booking_id')
    booking = Booking.query.filter_by(id=booking_id, user_id=session['user_id']).first() if booking_id else None

    if request.method == 'POST' and not booking:
        # Posted from booking form directly: create the booking first, then show payment page
        category = request.form.get('category', 'train')
        origin = request.form.get('origin')
        destination = request.form.get('destination')
        travel_date = request.form.get('travel_date')
        raw_passengers = request.form.get('passengers')
        passengers = int(raw_passengers) if (raw_passengers and category != 'hotel') else 1
        hotel_name = request.form.get('hotel_name') if category == 'hotel' else None

        base_prices = {'train': 500, 'bus': 300, 'flight': 2000, 'hotel': 1500}
        base_price = base_prices.get(category, 500)
        total_price = base_price * passengers

        try:
            new_booking = Booking(
                user_id=session['user_id'],
                destination=f"{origin} → {destination}{' - ' + hotel_name if hotel_name else ''}",
                travel_date=datetime.strptime(travel_date, '%Y-%m-%d').date(),
                passengers=passengers,
                total_price=total_price
            )
            db.session.add(new_booking)
            db.session.commit()
            return render_template('payment.html', booking=new_booking)
        except Exception:
            flash('Could not initiate payment. Please try again.', 'error')
            return redirect(url_for('booking'))

    if not booking:
        flash('No booking found to pay for.', 'error')
        return redirect(url_for('booking'))

    return render_template('payment.html', booking=booking)

@app.route('/payment/confirm', methods=['POST'])
def payment_confirm():
    if 'user_id' not in session:
        flash('Please login to continue!', 'error')
        return redirect(url_for('login'))

    booking_id = request.form.get('booking_id')
    booking = Booking.query.filter_by(id=booking_id, user_id=session['user_id']).first()
    if not booking:
        flash('Invalid booking.', 'error')
        return redirect(url_for('booking'))

    # Simulate payment success
    flash('Payment successful! Your booking is confirmed.', 'success')
    return render_template('confirmation.html', booking=booking)

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact page"""
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        message = request.form['message']
        
        # Here you would typically send an email or save to database
        flash('Thank you for your message! We will get back to you soon.', 'success')
        return redirect(url_for('contact'))
    
    return render_template('contact.html')

@app.route('/my-bookings')
def my_bookings():
    """User's booking history"""
    if 'user_id' not in session:
        flash('Please login to view your bookings!', 'error')
        return redirect(url_for('login'))
    
    bookings = Booking.query.filter_by(user_id=session['user_id']).order_by(Booking.booking_date.desc()).all()
    return render_template('my_bookings.html', bookings=bookings)

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('500.html'), 500

# Initialize database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

