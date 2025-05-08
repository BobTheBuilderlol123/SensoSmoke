// Main JavaScript for VapeSense website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Set up navbar scroll behavior
    setupNavbar();
    
    // Initialize interactive elements
    setupInteractiveElements();
    
    // Handle contact form submission
    setupContactForm();
  });
  
  /**
   * Initialize animations for elements that fade in when scrolled into view
   */
  function initAnimations() {
    // Initial check for elements in view
    animateOnScroll();
    
    // Set up scroll listener
    window.addEventListener('scroll', animateOnScroll);
    
    function animateOnScroll() {
      const elements = document.querySelectorAll('.fade-in, .scale-in');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementHeight = element.getBoundingClientRect().height;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - elementHeight / 3) {
          element.classList.add('visible');
        }
      });
    }
  }
  
  /**
   * Setup navbar scroll behavior
   */
  function setupNavbar() {
    const navbar = document.querySelector('.navbar');
    
    function handleScroll() {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Account for navbar height
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  /**
   * Set up interactive elements like sliders and tabs
   */
  function setupInteractiveElements() {
    // Timeline slider
    const timelineSlider = document.getElementById('timeline-slider');
    if (timelineSlider) {
      timelineSlider.addEventListener('input', function() {
        updateTimelineContent(this.value);
      });
      
      // Initialize with default value
      updateTimelineContent(timelineSlider.value);
    }
    
    function updateTimelineContent(value) {
      const milestone = getMilestoneForValue(value);
      const contentContainer = document.getElementById('milestone-content');
      
      if (contentContainer) {
        contentContainer.innerHTML = '';
        
        const title = document.createElement('h4');
        title.className = 'milestone-title';
        title.textContent = healthImpacts[milestone].title;
        
        const list = document.createElement('ul');
        
        healthImpacts[milestone].impacts.forEach(impact => {
          const item = document.createElement('li');
          item.textContent = impact;
          list.appendChild(item);
        });
        
        contentContainer.appendChild(title);
        contentContainer.appendChild(list);
      }
    }
    
    function getMilestoneForValue(value) {
      const numericValue = parseInt(value, 10);
      if (numericValue < 25) return 0;
      if (numericValue < 50) return 1;
      if (numericValue < 75) return 2;
      return 3;
    }
    
    // Health impacts data
    const healthImpacts = [
      {
        title: "At First Use:",
        impacts: [
          "Immediate increase in heart rate and blood pressure",
          "Potential throat and lung irritation",
          "Initial nicotine exposure affecting brain chemistry",
          "Possible headaches or dizziness"
        ]
      },
      {
        title: "At 3 Months of Regular Use:",
        impacts: [
          "Development of nicotine tolerance requiring more use",
          "Early signs of respiratory irritation",
          "Potential changes in mood regulation",
          "Increased anxiety between vaping sessions"
        ]
      },
      {
        title: "At 6 Months of Regular Use:",
        impacts: [
          "50% increase in respiratory symptoms",
          "Measurable decrease in lung function",
          "Development of nicotine dependence patterns",
          "Increased likelihood of anxiety symptoms"
        ]
      },
      {
        title: "At 1 Year of Regular Use:",
        impacts: [
          "Chronic respiratory issues may develop",
          "Significant neural pathway changes in the brain",
          "Notable impacts on memory and concentration",
          "Increased symptoms of depression and anxiety"
        ]
      }
    ];
  }
  
  /**
   * Handle contact form submission
   */
  function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formValues = Object.fromEntries(formData.entries());
        
        // Form validation
        const errors = validateContactForm(formValues);
        
        if (Object.keys(errors).length > 0) {
          displayFormErrors(errors);
          return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        try {
          // Submit form data to the server
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formValues),
          });
          
          if (!response.ok) {
            throw new Error('Form submission failed');
          }
          
          // Show success message
          contactForm.reset();
          showNotification('Thank you for your submission! We\'ll be in touch soon.', 'success');
        } catch (error) {
          console.error('Error submitting form:', error);
          showNotification('There was a problem submitting your request. Please try again.', 'error');
        } finally {
          // Reset button state
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        }
      });
    }
    
    function validateContactForm(values) {
      const errors = {};
      
      if (!values.name || values.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }
      
      if (!values.position || values.position.length < 2) {
        errors.position = 'Position must be at least 2 characters';
      }
      
      if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (!values.school || values.school.length < 2) {
        errors.school = 'School name must be at least 2 characters';
      }
      
      return errors;
    }
    
    function displayFormErrors(errors) {
      // Clear previous errors
      document.querySelectorAll('.form-error').forEach(el => el.remove());
      
      // Display new errors
      for (const [field, message] of Object.entries(errors)) {
        const inputElement = document.querySelector(`[name="${field}"]`);
        if (inputElement) {
          const errorElement = document.createElement('div');
          errorElement.className = 'form-error';
          errorElement.textContent = message;
          errorElement.style.color = 'red';
          errorElement.style.fontSize = '0.875rem';
          errorElement.style.marginTop = '0.25rem';
          
          inputElement.parentNode.appendChild(errorElement);
          inputElement.classList.add('error-input');
        }
      }
    }
    
    function showNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Remove notification after 5 seconds
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 5000);
    }
  }
  
  // Statistics data for the website
  const statistics = [
    {
      value: "27%",
      description: "of high school students have used e-cigarettes in the past 30 days"
    },
    {
      value: "68%",
      description: "increase in teen anxiety and depression linked to vaping"
    },
    {
      value: "84%",
      description: "of schools report bathroom vaping as a significant challenge"
    },
    {
      value: "5.4M",
      description: "U.S. middle and high school students currently use e-cigarettes"
    }
  ];
  
  // Navigation links
  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Education", href: "#education" },
    { name: "Our Product", href: "#product" },
    { name: "How It Works", href: "#demo" },
    { name: "Resources", href: "#resources" }
  ];