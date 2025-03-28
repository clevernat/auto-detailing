// EmailJS integration for RJ Auto Detailing
// This script handles form submissions and sends emails without a backend

document.addEventListener("DOMContentLoaded", function () {
  // Initialize EmailJS with user ID from environment variables
  const EMAILJS_USER_ID = window.emailJsConfig.EMAILJS_USER_ID;
  
  // Make sure EmailJS is properly initialized
  if (typeof emailjs !== 'undefined' && emailjs.init) {
    emailjs.init(EMAILJS_USER_ID);
    console.log("EmailJS initialized");
  } else {
    console.error("EmailJS not available. Forms may not work correctly.");
  }

  // Contact form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Contact form submitted");

      // Show loading indicator
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Get current date and time for the submission timestamp
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Prepare template parameters
      const templateParams = {
        name: contactForm.querySelector("#name").value,
        email: contactForm.querySelector("#email").value,
        phone: contactForm.querySelector("#phone").value || "Not provided",
        service: contactForm.querySelector("#service").value || "Not specified",
        message: contactForm.querySelector("#message").value,
        submitted_at: formattedDate,
      };

      console.log("Sending email with params:", templateParams);

      try {
        // Send the email using EmailJS
        emailjs
          .send(
            window.emailJsConfig.EMAILJS_SERVICE_ID,
            window.emailJsConfig.EMAILJS_CONTACT_TEMPLATE_ID,
            templateParams
          )
          .then(function (response) {
            console.log("SUCCESS!", response.status, response.text);

            // Show success message
            showFormMessage(
              contactForm,
              "Thank you for your message! We'll get back to you soon.",
              "success"
            );

            // Reset form
            contactForm.reset();
          })
          .catch(function (error) {
            console.log("FAILED...", error);

            // Show error message
            showFormMessage(
              contactForm,
              "Sorry, there was a problem sending your message. Please try again later.",
              "error"
            );
          })
          .finally(function () {
            // Restore button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
          });
      } catch (error) {
        console.error("Error sending email:", error);
        showFormMessage(
          contactForm,
          "Sorry, there was a problem with the email service. Please try again later.",
          "error"
        );
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  } else {
    console.error("Contact form not found");
  }

  // Booking form submission
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Booking form submitted");

      // Show loading indicator
      const submitBtn = bookingForm.querySelector("button[type='submit']");
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Processing...';
      submitBtn.disabled = true;

      // Get selected services
      const selectedServices = [];
      bookingForm
        .querySelectorAll('input[name="services"]:checked')
        .forEach((checkbox) => {
          selectedServices.push(checkbox.value);
        });

      // Format date for email template
      const bookingDate = bookingForm.querySelector("#bookingDate").value;
      const formattedDate = new Date(bookingDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Get current date and time for the submission timestamp
      const now = new Date();
      const submittedAt = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Prepare template parameters
      const templateParams = {
        name: bookingForm.querySelector("#bookingName").value,
        email: bookingForm.querySelector("#bookingEmail").value,
        phone: bookingForm.querySelector("#bookingPhone").value,
        date: formattedDate,
        time: bookingForm.querySelector("#bookingTime").value,
        services: selectedServices.join(", ") || "Not specified",
        notes:
          bookingForm.querySelector("#bookingNotes").value ||
          "No additional notes",
        submitted_at: submittedAt,
      };

      console.log("Sending booking email with params:", templateParams);

      try {
        // Send the email using EmailJS
        emailjs
          .send(
            window.emailJsConfig.EMAILJS_SERVICE_ID,
            window.emailJsConfig.EMAILJS_BOOKING_TEMPLATE_ID,
            templateParams
          )
          .then(function (response) {
            console.log("SUCCESS!", response.status, response.text);

            // Show success message and reset form
            bookingForm.reset();

            // Close the modal and redirect to confirmation page
            document.querySelector(".booking-modal").classList.remove("active");
            setTimeout(() => {
              document
                .querySelector(".booking-modal-overlay")
                .classList.remove("active");
              document.body.style.overflow = "";
              window.location.href = bookingForm.getAttribute("action");
            }, 500);
          })
          .catch(function (error) {
            console.log("FAILED...", error);

            // Show error message
            alert(
              "Sorry, there was a problem processing your booking. Please try again later."
            );
          })
          .finally(function () {
            // Restore button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
          });
      } catch (error) {
        console.error("Error sending booking email:", error);
        alert(
          "Sorry, there was a problem with the email service. Please try again later."
        );
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  } else {
    console.error("Booking form not found");
  }

  // Helper function to show form messages
  function showFormMessage(form, messageText, type) {
    // Remove any existing messages
    const existingMessage = form.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const message = document.createElement("div");
    message.className = `form-message ${type}`;
    message.innerHTML = messageText;

    // Add message to form
    form.appendChild(message);

    // Remove message after 5 seconds
    setTimeout(() => {
      message.classList.add("fade-out");
      setTimeout(() => {
        message.remove();
      }, 500);
    }, 5000);
  }
});