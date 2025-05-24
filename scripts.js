document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const configContents = document.querySelectorAll('.config-content');
    const loginBtn = document.getElementById('login-btn');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const loginModal = document.getElementById('login-modal');
    const paymentModal = document.getElementById('payment-modal');
    const loginTabs = document.querySelectorAll('.login-tab');
    const loginForms = document.querySelectorAll('.login-form-container');
    const premiumBtns = document.querySelectorAll('.btn-premium');
    const paymentForm = document.getElementById('mpesa-form');
    const closeBtns = document.querySelectorAll('.close');
    const robbieJRBtn = document.getElementById('robbiejr-class-btn');
    const robbieJRModal = document.getElementById('robbiejr-class-modal');
    const feedbackForm = document.getElementById('feedback-form');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu && mobileMenu.style.display === 'block' && !e.target.closest('.menu-toggle') && !e.target.closest('.mobile-menu')) {
            mobileMenu.style.display = 'none';
        }
    });
    
    // Dark theme toggle
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDarkTheme = document.body.classList.contains('dark-theme');
            themeToggleBtn.innerHTML = isDarkTheme ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        });
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
    
    // Config tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tab buttons
            tabBtns.forEach(tab => tab.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Hide all content
            configContents.forEach(content => content.classList.remove('active'));
            
            // Show content associated with clicked tab
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(`${tabId}-configs`).classList.add('active');
        });
    });
    
    // Login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
    }
    
    if (mobileLoginBtn) {
        mobileLoginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
            mobileMenu.style.display = 'none';
        });
    }
    
    // Login tabs
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            loginTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all form containers
            loginForms.forEach(form => form.classList.remove('active'));
            
            // Show form container associated with clicked tab
            const formId = tab.getAttribute('data-tab');
            document.getElementById(`${formId}-form`).classList.add('active');
        });
    });
    
    // Premium buttons (M-Pesa payment)
    premiumBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const configId = btn.getAttribute('data-id');
            const price = btn.getAttribute('data-price');
            const configName = btn.parentElement.querySelector('h3').textContent;
            const configFile = btn.getAttribute('data-file');
            
            // Set payment modal details
            document.getElementById('payment-info').textContent = `Pay for ${configName}`;
            document.getElementById('payment-amount').textContent = price;
            
            // Store config ID and file for payment processing
            document.getElementById('mpesa-form').setAttribute('data-config', configId);
            document.getElementById('mpesa-form').setAttribute('data-file', configFile);
            
            // Show payment modal
            paymentModal.style.display = 'block';
        });
    });
    
    // Payment form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const phoneNumber = document.getElementById('phone-number').value;
            const configId = this.getAttribute('data-config');
            const configFile = this.getAttribute('data-file');
            const amount = document.getElementById('payment-amount').textContent;
            const configName = document.getElementById('payment-info').textContent.replace('Pay for ', '');
            
            // Validate phone number (Kenyan format)
            const phoneRegex = /^(07|01)[0-9]{8}$/;
            if (!phoneRegex.test(phoneNumber)) {
                document.getElementById('payment-status').textContent = "Please enter a valid M-Pesa number (07XXXXXXXX or 01XXXXXXXX)";
                document.getElementById('payment-status').style.color = "var(--danger-color)";
                return;
            }
            
            // Show loading state
            document.getElementById('pay-button').disabled = true;
            document.getElementById('pay-button').textContent = "Processing...";
            document.getElementById('payment-status').textContent = "Sending payment request to M-Pesa...";
            document.getElementById('payment-status').style.color = "var(--info-color)";
            
            // Simulate M-Pesa payment process
            setTimeout(() => {
                // In a real implementation, you would call your backend API here
                fetch('verify_payment.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        phone: phoneNumber,
                        amount: amount,
                        configId: configId,
                        configFile: configFile
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Payment successful
                        document.getElementById('payment-status').textContent = "Payment successful! Access granted.";
                        document.getElementById('payment-status').style.color = "var(--success-color)";
                        
                        // Replace buy button with download button
                        const btn = document.querySelector(`.btn-premium[data-id="${configId}"]`);
                        const downloadBtn = document.createElement('a');
                        downloadBtn.href = `download.php?file=${configFile}&type=premium`;
                        downloadBtn.className = 'btn btn-download';
                        downloadBtn.textContent = 'Download';
                        btn.parentNode.replaceChild(downloadBtn, btn);
                        
                        // Close modal after success
                        setTimeout(() => {
                            paymentModal.style.display = 'none';
                            alert("Payment successful! You can now download the configuration.");
                            
                            // Re-enable button
                            document.getElementById('pay-button').disabled = false;
                            document.getElementById('pay-button').textContent = "Pay Now";
                        }, 1500);
                    } else {
                        // Payment failed
                        document.getElementById('payment-status').textContent = data.message || "Payment failed. Please try again.";
                        document.getElementById('payment-status').style.color = "var(--danger-color)";
                        document.getElementById('pay-button').disabled = false;
                        document.getElementById('pay-button').textContent = "Pay Now";
                    }
                })
                .catch(error => {
                    document.getElementById('payment-status').textContent = "Network error. Please try again.";
                    document.getElementById('payment-status').style.color = "var(--danger-color)";
                    document.getElementById('pay-button').disabled = false;
                    document.getElementById('pay-button').textContent = "Pay Now";
                });
            }, 2000);
        });
    }
    
    // Close modals with close button
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // RobbieJR CLASS button
    if (robbieJRBtn) {
        robbieJRBtn.addEventListener('click', function() {
            robbieJRModal.style.display = 'block';
        });
    }
    
    // Feedback form submission
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
            
            // Telegram bot details
            const botToken = '7756702380:AAFtev0dwCjhR6FJQft6yRl7P0EE2BvzQJ4';
            const chatId = '7819091632';
            const text = `New feedback from ${name} (${email}):\n\n${message}`;
            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    alert("Thank you for your feedback! We'll get back to you soon.");
                    feedbackForm.reset();
                } else {
                    alert("Failed to send feedback. Please try again later.");
                }
            })
            .catch(error => {
                alert("Failed to send feedback. Please try again later.");
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = "Send Message";
            });
        });
    }
    
    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            const submitBtn = this.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = "Subscribing...";
            
            // Simulate form submission
            setTimeout(() => {
                alert("Thank you for subscribing to our newsletter!");
                this.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = "Subscribe";
            }, 1500);
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (mobileMenu && mobileMenu.style.display === 'block') {
                        mobileMenu.style.display = 'none';
                    }
                    
                    // Scroll to target
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Initialize PayPal buttons (if needed)
    if (document.getElementById('paypal-button-container')) {
        // Placeholder for PayPal button
        const paypalContainer = document.getElementById('paypal-button-container');
        const paypalBtn = document.createElement('button');
        paypalBtn.className = 'btn';
        paypalBtn.style.backgroundColor = '#0070ba';
        paypalBtn.style.display = 'flex';
        paypalBtn.style.alignItems = 'center';
        paypalBtn.style.justifyContent = 'center';
        paypalBtn.style.gap = '0.5rem';
        paypalBtn.innerHTML = '<i class="fab fa-paypal"></i> Pay with PayPal';
        
        paypalBtn.addEventListener('click', function() {
            // In a real implementation, this would integrate with PayPal API
            const configName = document.querySelector('.international-premium h3').textContent;
            const price = document.querySelector('.international-premium .config-price').textContent;
            
            alert(`This would process PayPal payment for ${configName} (${price}) in a real implementation.`);
        });
        
        paypalContainer.appendChild(paypalBtn);
    }
    
    // Check for existing premium access
    function checkPremiumAccess() {
        // In a real implementation, you would check with your backend
        // For this demo, we'll check localStorage
        const premiumAccess = localStorage.getItem('premiumAccess');
        if (premiumAccess) {
            const { configId, file } = JSON.parse(premiumAccess);
            const btn = document.querySelector(`.btn-premium[data-id="${configId}"]`);
            if (btn) {
                const downloadBtn = document.createElement('a');
                downloadBtn.href = `download.php?file=${file}&type=premium`;
                downloadBtn.className = 'btn btn-download';
                downloadBtn.textContent = 'Download';
                btn.parentNode.replaceChild(downloadBtn, btn);
            }
        }
    }
    
    checkPremiumAccess();
});