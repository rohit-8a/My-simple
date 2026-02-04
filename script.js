// Mobile Menu Toggle
function toggleMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Smooth Scroll to Courses
function scrollToCourses() {
    document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
}

// Show Login Modal
function showLogin() {
    document.getElementById('loginModal').classList.add('active');
}

// Close Login Modal
function closeLogin() {
    document.getElementById('loginModal').classList.remove('active');
}

// Show Signup (placeholder)
function showSignup() {
    alert('Signup functionality coming soon!');
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    alert('Login functionality will be connected to backend!');
    closeLogin();
}

// Enroll Now
function enrollNow(courseName) {
    alert(`Thank you for your interest in "${courseName}"! Redirecting to payment...`);
}

// Show Video Demo
function showVideo() {
    alert('Video demo coming soon!');
}

// Handle Contact Form
function handleSubmit(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLogin();
    }
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});
