// Environment Configuration
(function() {
    // Default fallback values (replace these with your actual default values)
    const defaultConfig = {
        EMAILJS_USER_ID: 'default_user_id',
        EMAILJS_SERVICE_ID: 'default_service_id',
        EMAILJS_CONTACT_TEMPLATE_ID: 'default_contact_template',
        EMAILJS_BOOKING_TEMPLATE_ID: 'default_booking_template',
        EMAILJS_NEWSLETTER_TEMPLATE_ID: 'default_newsletter_template'
    };

    // Function to get environment variable (for client-side use)
    window.getEnvVar = function(key) {
        // In a real-world scenario, you'd use a more secure method
        // This is a simple placeholder
        return defaultConfig[key] || '';
    };
})();