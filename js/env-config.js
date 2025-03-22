// Environment Configuration
(function() {
    // Hardcoded EmailJS configuration
    const emailJsConfig = {
        EMAILJS_USER_ID: 'XSoxMzmKmY1-e8_8q', // Make sure this is your correct public key
        EMAILJS_SERVICE_ID: 'service_imyvrbw',
        EMAILJS_CONTACT_TEMPLATE_ID: 'template_quiv36v',
        EMAILJS_BOOKING_TEMPLATE_ID: 'template_mys1ws6',
        EMAILJS_NEWSLETTER_TEMPLATE_ID: 'template_newsletter'
    };

    // Function to get environment variable (for client-side use)
    window.getEnvVar = function(key) {
        return emailJsConfig[key] || '';
    };

    // Expose configuration for direct use if needed
    window.emailJsConfig = emailJsConfig;
})();