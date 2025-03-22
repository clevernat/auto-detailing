// EmailJS integration for RJ Auto Detailing
// This script handles form submissions and sends emails without a backend

document.addEventListener("DOMContentLoaded", function () {
  // Initialize EmailJS with user ID from environment variables
  const EMAILJS_USER_ID = window.getEnvVar('EMAILJS_USER_ID');
  emailjs.init(EMAILJS_USER_ID);
  console.log("EmailJS initialized");

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

      // Send the email using EmailJS
      emailjs
        .send("service_imyvrbw", "template_quiv36v", templateParams)
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
    });
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

      // Send the email using EmailJS
      emailjs
        .send("service_imyvrbw", "template_mys1ws6", templateParams)
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
    });
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

  // Add event listener for newsletter form if it exists
  const newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Newsletter form submitted");

      const emailInput = newsletterForm.querySelector("input[type='email']");
      const submitBtn = newsletterForm.querySelector("button[type='submit']");

      // Disable button and show loading state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      // Prepare template parameters
      const templateParams = {
        email: emailInput.value,
        submitted_at: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      console.log(
        "Sending newsletter subscription with params:",
        templateParams
      );

      // Send the email using EmailJS
      emailjs
        .send("service_imyvrbw", "template_newsletter", templateParams)
        .then(function (response) {
          console.log("SUCCESS!", response.status, response.text);

          // Reset form
          newsletterForm.reset();

          // Show success message
          const newsletterContainer =
            newsletterForm.closest(".footer-newsletter");
          if (newsletterContainer) {
            const message = document.createElement("div");
            message.className = "form-message success";
            message.innerHTML = "Thank you for subscribing to our newsletter!";
            newsletterContainer.appendChild(message);

            // Remove message after 5 seconds
            setTimeout(() => {
              message.classList.add("fade-out");
              setTimeout(() => {
                message.remove();
              }, 500);
            }, 5000);
          }
        })
        .catch(function (error) {
          console.log("FAILED...", error);
          alert(
            "Sorry, there was a problem with your subscription. Please try again later."
          );
        })
        .finally(function () {
          // Restore button state
          submitBtn.innerHTML = originalBtnHTML;
          submitBtn.disabled = false;
        });
    });
  }
});
