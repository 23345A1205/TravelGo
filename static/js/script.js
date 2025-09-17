// TravelGo JavaScript Functions

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupPasswordToggles();
    setupFormValidation();
    setupBookingCalculator();
    setupSmoothScrolling();
    setupAnimations();
    setupModals();
}

// Password Toggle Functionality
function setupPasswordToggles() {
    const passwordToggles = document.querySelectorAll('[id^="togglePassword"], [id^="toggleConfirmPassword"]');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.id === 'togglePassword' ? 'password' : 
                           this.id === 'toggleConfirmPassword' ? 'confirm_password' : '';
            const passwordField = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordField) {
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordField.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            }
        });
    });
}

// Form Validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                return false;
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

// Validate Individual Form
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Special validation for registration form
    if (form.id === 'registerForm') {
        const password = form.querySelector('#password');
        const confirmPassword = form.querySelector('#confirm_password');
        
        if (password && confirmPassword) {
            if (password.value !== confirmPassword.value) {
                showFieldError(confirmPassword, 'Passwords do not match');
                isValid = false;
            }
        }
        
        if (password && password.value.length < 6) {
            showFieldError(password, 'Password must be at least 6 characters long');
            isValid = false;
        }
    }
    
    // Special validation for booking form
    if (form.id === 'bookingForm') {
        const travelDate = form.querySelector('#travel_date');
        if (travelDate) {
            const selectedDate = new Date(travelDate.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showFieldError(travelDate, 'Travel date must be in the future');
                isValid = false;
            }
        }
    }
    
    return isValid;
}

// Validate Individual Field
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, `${getFieldLabel(field)} is required`);
        return false;
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Password validation
    if (fieldName === 'password' && value && value.length < 6) {
        showFieldError(field, 'Password must be at least 6 characters long');
        return false;
    }
    
    // Name validation
    if (fieldName === 'name' && value && value.length < 2) {
        showFieldError(field, 'Name must be at least 2 characters long');
        return false;
    }
    
    return true;
}

// Show Field Error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear Field Error
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Get Field Label
function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    return label ? label.textContent.replace('*', '').trim() : field.name;
}

// Booking Calculator
function setupBookingCalculator() {
    const categorySelect = document.getElementById('category');
    const destinationSelect = document.getElementById('destination');
    const originSelect = document.getElementById('origin');
    const passengersSelect = document.getElementById('passengers');
    const classSelect = document.getElementById('travel_class');
    const passengerCount = document.getElementById('passengerCount');
    const classMultiplier = document.getElementById('classMultiplier');
    const totalPrice = document.getElementById('totalPrice');
    const basePriceValue = document.getElementById('basePriceValue');
    const passengersGroup = document.getElementById('passengersGroup');
    const hotelNameGroup = document.getElementById('hotelNameGroup');
    const categoryIcon = document.getElementById('categoryIcon');
    
    if (passengersSelect && classSelect && totalPrice) {
        const categoryConfigs = {
            train: {
                base: 500,
                destinations: [
                    { value: 'Delhi', label: 'Delhi - From ₹499' },
                    { value: 'Mumbai', label: 'Mumbai - From ₹599' },
                    { value: 'Bengaluru', label: 'Bengaluru - From ₹549' },
                    { value: 'Kolkata', label: 'Kolkata - From ₹499' },
                    { value: 'Chennai', label: 'Chennai - From ₹549' },
                    { value: 'Hyderabad', label: 'Hyderabad - From ₹549' },
                    { value: 'Jaipur', label: 'Jaipur - From ₹449' },
                    { value: 'Varanasi', label: 'Varanasi - From ₹499' }
                ],
                classes: [
                    { value: 'economy', text: 'Sleeper (1x)', mult: 1 },
                    { value: 'business', text: '3A (1.5x)', mult: 1.5 },
                    { value: 'first', text: '2A (2x)', mult: 2 }
                ]
            },
            bus: {
                base: 300,
                destinations: [
                    { value: 'Delhi', label: 'Delhi - From ₹299' },
                    { value: 'Mumbai', label: 'Mumbai - From ₹349' },
                    { value: 'Bengaluru', label: 'Bengaluru - From ₹329' },
                    { value: 'Kolkata', label: 'Kolkata - From ₹299' },
                    { value: 'Chennai', label: 'Chennai - From ₹329' },
                    { value: 'Hyderabad', label: 'Hyderabad - From ₹329' },
                    { value: 'Jaipur', label: 'Jaipur - From ₹279' },
                    { value: 'Goa', label: 'Goa - From ₹399' }
                ],
                classes: [
                    { value: 'non_ac_seater', text: 'Non-AC Seater (1x)', mult: 1 },
                    { value: 'ac_seater', text: 'AC Seater (1.2x)', mult: 1.2 },
                    { value: 'non_ac_sleeper', text: 'Non-AC Sleeper (1.3x)', mult: 1.3 },
                    { value: 'ac_sleeper', text: 'AC Sleeper (1.5x)', mult: 1.5 }
                ]
            },
            flight: {
                base: 2000,
                destinations: [
                    { value: 'Delhi', label: 'Delhi - From ₹1999' },
                    { value: 'Mumbai', label: 'Mumbai - From ₹2199' },
                    { value: 'Bengaluru', label: 'Bengaluru - From ₹2099' },
                    { value: 'Kolkata', label: 'Kolkata - From ₹1999' },
                    { value: 'Chennai', label: 'Chennai - From ₹2099' },
                    { value: 'Hyderabad', label: 'Hyderabad - From ₹2099' },
                    { value: 'Goa', label: 'Goa - From ₹2499' },
                    { value: 'Kochi', label: 'Kochi - From ₹2299' }
                ],
                classes: [
                    { value: 'economy', text: 'Economy (1x)', mult: 1 },
                    { value: 'business', text: 'Business (1.5x)', mult: 1.5 },
                    { value: 'first', text: 'First (2x)', mult: 2 }
                ]
            },
            hotel: {
                base: 1500,
                destinations: [
                    { value: 'Delhi', label: 'Delhi - From ₹1499/night' },
                    { value: 'Mumbai', label: 'Mumbai - From ₹1699/night' },
                    { value: 'Bengaluru', label: 'Bengaluru - From ₹1599/night' },
                    { value: 'Kolkata', label: 'Kolkata - From ₹1499/night' },
                    { value: 'Chennai', label: 'Chennai - From ₹1599/night' },
                    { value: 'Hyderabad', label: 'Hyderabad - From ₹1599/night' },
                    { value: 'Jaipur', label: 'Jaipur - From ₹1399/night' },
                    { value: 'Goa', label: 'Goa - From ₹1999/night' }
                ],
                classes: [
                    { value: 'economy', text: 'Standard (1x)', mult: 1 },
                    { value: 'business', text: 'Deluxe (1.5x)', mult: 1.5 },
                    { value: 'first', text: 'Suite (2x)', mult: 2 }
                ]
            }
        };

        function populateDestinationsAndClasses() {
            const selectedCategory = (categorySelect && categorySelect.value) || 'train';
            const cfg = categoryConfigs[selectedCategory];
            if (!cfg) return;

            if (destinationSelect) {
                destinationSelect.innerHTML = '<option value="">Choose destination...</option>';
                cfg.destinations.forEach(d => {
                    const opt = document.createElement('option');
                    opt.value = d.value;
                    opt.textContent = d.label;
                    destinationSelect.appendChild(opt);
                });
            }

            if (classSelect) {
                classSelect.innerHTML = '';
                cfg.classes.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.value;
                    opt.textContent = c.text;
                    classSelect.appendChild(opt);
                });
            }

            if (basePriceValue) {
                basePriceValue.textContent = `₹${cfg.base}`;
            }

            calculatePrice();
        }

        function getMultiplierForClass(value) {
            const selectedCategory = (categorySelect && categorySelect.value) || 'train';
            const cfg = categoryConfigs[selectedCategory];
            const found = cfg.classes.find(c => c.value === value);
            return found ? found.mult : 1;
        }

        function preventSameOriginDestination() {
            if (!originSelect || !destinationSelect) return;
            const origin = originSelect.value;
            [...destinationSelect.options].forEach(opt => {
                if (opt.value === origin && opt.value !== '') {
                    opt.disabled = true;
                } else {
                    opt.disabled = false;
                }
            });
        }

        function toggleHotelFields() {
            const selectedCategory = (categorySelect && categorySelect.value) || 'train';
            const isHotel = selectedCategory === 'hotel';
            if (passengersGroup) {
                passengersGroup.classList.toggle('d-none', isHotel);
                const select = passengersGroup.querySelector('select');
                if (select) select.required = !isHotel;
            }
            if (hotelNameGroup) {
                hotelNameGroup.classList.toggle('d-none', !isHotel);
                const input = hotelNameGroup.querySelector('input');
                if (input) input.required = isHotel;
            }
        }

        function updateHeaderIcon() {
            if (!categoryIcon) return;
            const selectedCategory = (categorySelect && categorySelect.value) || 'train';
            const map = {
                train: 'fa-train',
                bus: 'fa-bus',
                flight: 'fa-plane',
                hotel: 'fa-hotel'
            };
            categoryIcon.className = 'fas me-2';
            categoryIcon.classList.add(map[selectedCategory] || 'fa-calendar-plus');
        }

        function calculatePrice() {
            const passengers = parseInt(passengersSelect && passengersSelect.value) || 0;
            const travelClass = classSelect.value;
            const selectedCategory = (categorySelect && categorySelect.value) || 'train';
            const cfg = categoryConfigs[selectedCategory];
            const multiplier = getMultiplierForClass(travelClass);
            const basePrice = cfg.base;
            const effectivePassengers = selectedCategory === 'hotel' ? 1 : passengers;
            const total = basePrice * effectivePassengers * multiplier;
            
            if (passengerCount) {
                passengerCount.textContent = selectedCategory === 'hotel' ? 1 : passengers;
            }
            
            if (classMultiplier) {
                const classText = travelClass.charAt(0).toUpperCase() + travelClass.slice(1);
                classMultiplier.textContent = `${classText} (${multiplier}x)`;
            }
            
            totalPrice.textContent = `₹${total.toFixed(2)}`;
        }
        
        if (categorySelect) categorySelect.addEventListener('change', function() {
            populateDestinationsAndClasses();
            toggleHotelFields();
            updateHeaderIcon();
        });
        if (passengersSelect) passengersSelect.addEventListener('change', calculatePrice);
        classSelect.addEventListener('change', calculatePrice);
        if (destinationSelect) destinationSelect.addEventListener('change', function(){
            preventSameOriginDestination();
            calculatePrice();
        });
        if (originSelect) originSelect.addEventListener('change', function(){
            preventSameOriginDestination();
            calculatePrice();
        });
        
        // Initial calculation
        populateDestinationsAndClasses();
        preventSameOriginDestination();
        toggleHotelFields();
        updateHeaderIcon();
    }
}

// Smooth Scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animations
function setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .feature-card, .destination-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Modal Functions
function setupModals() {
    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

// Booking Functions
function printBooking(bookingId) {
    // In a real application, this would generate a printable booking confirmation
    window.print();
}

function viewDetails(bookingId) {
    // In a real application, this would show detailed booking information
    const modal = new bootstrap.Modal(document.getElementById('bookingDetailsModal'));
    const content = document.getElementById('bookingDetailsContent');
    
    // Mock booking details
    content.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <h6>Booking ID</h6>
                <p>#${bookingId}</p>
                
                <h6>Destination</h6>
                <p>Paris, France</p>
                
                <h6>Travel Date</h6>
                <p>March 15, 2024</p>
            </div>
            <div class="col-md-6">
                <h6>Passengers</h6>
                <p>2 Adults</p>
                
                <h6>Total Price</h6>
                <p class="text-success fw-bold">$200.00</p>
                
                <h6>Status</h6>
                <span class="badge bg-success">Confirmed</span>
            </div>
        </div>
    `;
    
    modal.show();
}

function modifyBooking(bookingId) {
    // In a real application, this would redirect to a modification page
    alert('Booking modification feature will be available soon!');
}

// Utility Functions
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Loading States
function showLoading(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
        Loading...
    `;
    element.disabled = true;
    
    return function hideLoading() {
        element.innerHTML = originalContent;
        element.disabled = false;
    };
}

// Form Submission with Loading
function submitFormWithLoading(form, submitButton) {
    const hideLoading = showLoading(submitButton);
    
    // Simulate form submission delay
    setTimeout(() => {
        hideLoading();
        // In a real application, this would handle the actual form submission
    }, 2000);
}

// Search Functionality (for future enhancement)
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const searchableElements = document.querySelectorAll('[data-searchable]');
            
            searchableElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    element.style.display = '';
                } else {
                    element.style.display = 'none';
                }
            });
        });
    }
}

// Initialize search if available
document.addEventListener('DOMContentLoaded', setupSearch);

// Export functions for global access
window.TravelGo = {
    showNotification,
    showLoading,
    submitFormWithLoading,
    printBooking,
    viewDetails,
    modifyBooking
};
