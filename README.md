# TravelGo - Travel Booking Platform

A complete travel booking web application built with Flask, featuring user authentication, booking management, and a modern responsive UI.

## Features

- **User Authentication**: Registration, login, and logout functionality
- **Travel Booking**: Book trips to various destinations with date and passenger selection
- **Booking Management**: View and manage your bookings
- **Responsive Design**: Modern UI with Bootstrap 5 and custom CSS
- **Form Validation**: Client-side and server-side validation
- **Database**: SQLite database for user and booking data

## Project Structure

```
travelgo/
├── templates/
│   ├── base.html          # Base template with navigation and footer
│   ├── home.html          # Landing page with featured destinations
│   ├── login.html         # User login page
│   ├── register.html      # User registration page
│   ├── booking.html       # Travel booking form
│   ├── about.html         # About us page
│   ├── contact.html       # Contact form
│   └── my_bookings.html   # User's booking history
├── static/
│   ├── css/
│   │   └── style.css      # Custom CSS styles
│   ├── js/
│   │   └── script.js      # JavaScript for interactivity
│   └── images/            # Placeholder images (replace with actual images)
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## Installation & Setup

1. **Install Python Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure AWS SNS (optional but recommended)**:
   - Create an SNS topic in your AWS account.
   - In your terminal or environment, set the following variables:
     ```bash
     set AWS_REGION=ap-south-1
     set AWS_ACCESS_KEY_ID=YOUR_KEY
     set AWS_SECRET_ACCESS_KEY=YOUR_SECRET
     set SNS_TOPIC_ARN=arn:aws:sns:ap-south-1:123456789012:travelgo-confirmations
     rem Optional for SMS if you want a default recipient
     set DEFAULT_SMS_NUMBER=+15551234567
     ```
   - Ensure the SNS topic policy allows `sns:Publish` for your credentials.
   - For email delivery: subscriptions must be confirmed by the recipient via the email link sent by AWS.

2. **Run the Application**:
   ```bash
   python app.py
   ```

3. **Access the Application**:
   Open your browser and go to `http://localhost:5000`

## Usage

### Getting Started
1. Visit the home page to see featured destinations
2. Register a new account or login with existing credentials
3. Book your travel by selecting destination, date, and number of passengers
4. View your bookings in the "My Bookings" section

### Features Overview

#### Home Page
- Hero section with call-to-action
- Featured destinations with pricing
- Why choose TravelGo section
- Statistics and testimonials

#### User Authentication
- Secure registration with password hashing
- Login/logout functionality
- Session management

#### Booking System
- Destination selection from popular cities
- Date picker with future date validation
- Passenger count selection
- Real-time price calculation
- Travel class selection

#### User Dashboard
- View all bookings
- Booking status tracking
- Print booking details
- Modify bookings (future feature)

## Database Schema

### Users Table
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `created_at`: Registration timestamp

### Bookings Table
- `id`: Primary key
- `user_id`: Foreign key to users table
- `destination`: Travel destination
- `travel_date`: Date of travel
- `passengers`: Number of passengers
- `total_price`: Total booking price
- `booking_date`: Booking timestamp
- `status`: Booking status (confirmed, cancelled, etc.)

## Customization

### Adding New Destinations
Edit the booking form in `templates/booking.html` to add new destination options.

### Styling
Modify `static/css/style.css` to customize the appearance and colors.

### Functionality
Add new features by extending `app.py` with additional routes and database models.

## Image Placeholders

The application includes placeholder text files for images. Replace these with actual images:

- `static/images/hero-travel.jpg` - Hero section image
- `static/images/paris.jpg` - Paris destination image
- `static/images/tokyo.jpg` - Tokyo destination image
- `static/images/sydney.jpg` - Sydney destination image
- `static/images/about-hero.jpg` - About page hero image
- `static/images/contact-hero.jpg` - Contact page hero image
- `static/images/team1.jpg` - Team member 1 photo
- `static/images/team2.jpg` - Team member 2 photo
- `static/images/team3.jpg` - Team member 3 photo

## Technologies Used

- **Backend**: Flask, SQLAlchemy, Werkzeug
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Database**: SQLite
- **Icons**: Font Awesome
- **Styling**: Custom CSS with gradients and animations

## Future Enhancements

- Payment integration
- Email notifications (implemented via AWS SNS Topic publish + optional SMS)
- Admin dashboard
- Advanced search and filtering
- User reviews and ratings
- Mobile app
- API endpoints
- Multi-language support

## License

This project is created for educational purposes. Feel free to use and modify as needed.

## Support

For questions or support, please contact us through the contact form on the website.
