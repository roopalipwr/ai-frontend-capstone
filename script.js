document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const feedbackEl = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');

    /**
     * Updates visual feedback for a field.
     * @param {HTMLElement} input 
     * @param {Object} result { isValid, message }
     */
    const updateFieldFeedback = (input, result) => {
        const errorEl = document.getElementById(`${input.id}-error`);
        if (!result.isValid) {
            input.classList.add('invalid');
            input.setAttribute('aria-invalid', 'true');
            if (errorEl) errorEl.textContent = result.message;
        } else {
            input.classList.remove('invalid');
            input.removeAttribute('aria-invalid');
            if (errorEl) errorEl.textContent = '';
        }
    };

    /**
     * Real-time Validation Event Listeners
     */
    fullNameInput.addEventListener('input', () => {
        updateFieldFeedback(fullNameInput, window.Validation.validateName(fullNameInput.value));
    });

    emailInput.addEventListener('input', () => {
        updateFieldFeedback(emailInput, window.Validation.validateEmail(emailInput.value));
    });

    passwordInput.addEventListener('input', () => {
        const passwordResult = window.Validation.validatePassword(passwordInput.value);
        updateFieldFeedback(passwordInput, passwordResult);
        
        // Also re-validate confirm password if it's not empty
        if (confirmPasswordInput.value) {
            const confirmResult = window.Validation.validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
            updateFieldFeedback(confirmPasswordInput, confirmResult);
        }
    });

    confirmPasswordInput.addEventListener('input', () => {
        const result = window.Validation.validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
        updateFieldFeedback(confirmPasswordInput, result);
    });

    /**
     * Form Submission Handling
     */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Run all validations
        const nameResult = window.Validation.validateName(fullNameInput.value);
        const emailResult = window.Validation.validateEmail(emailInput.value);
        const passwordResult = window.Validation.validatePassword(passwordInput.value);
        const confirmResult = window.Validation.validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);

        // Update all feedback
        updateFieldFeedback(fullNameInput, nameResult);
        updateFieldFeedback(emailInput, emailResult);
        updateFieldFeedback(passwordInput, passwordResult);
        updateFieldFeedback(confirmPasswordInput, confirmResult);

        const isFormValid = nameResult.isValid && emailResult.isValid && 
                            passwordResult.isValid && confirmResult.isValid;

        if (!isFormValid) {
            showFeedback('Please correct the errors before saving.', 'error');
            // Scroll to the first error
            const firstError = form.querySelector('.invalid');
            if (firstError) firstError.focus();
            return;
        }

        // Simulate API call
        setLoadingState(true);
        
        try {
            await simulateApiCall(new FormData(form));
            showFeedback('Settings saved successfully!', 'success');
        } catch (error) {
            showFeedback('An error occurred while saving. Please try again.', 'error');
        } finally {
            setLoadingState(false);
        }
    });

    /**
     * Shows form-level feedback message.
     * @param {string} message 
     * @param {string} type 'success' | 'error'
     */
    function showFeedback(message, type) {
        feedbackEl.textContent = message;
        feedbackEl.className = `form-feedback ${type}`;
        feedbackEl.style.display = ''; // Reset any manual display overrides
        
        // Auto-hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                feedbackEl.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Clears all validation errors and feedback.
     */
    function clearValidationState() {
        const inputs = [fullNameInput, emailInput, passwordInput, confirmPasswordInput];
        inputs.forEach(input => {
            input.classList.remove('invalid');
            input.removeAttribute('aria-invalid');
            const errorEl = document.getElementById(`${input.id}-error`);
            if (errorEl) errorEl.textContent = '';
        });
        feedbackEl.style.display = 'none';
        feedbackEl.textContent = '';
    }

    /**
     * Form Reset Handling
     */
    form.addEventListener('reset', () => {
        clearValidationState();
    });

    /**
     * Sets the form loading state.
     * @param {boolean} isLoading 
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
            feedbackEl.style.display = 'none';
        } else {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Changes';
        }
    }

    /**
     * Simulates an asynchronous API call.
     * @param {FormData} formData 
     * @returns {Promise}
     */
    function simulateApiCall(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = {};
                formData.forEach((value, key) => { data[key] = value; });
                console.log('Simulated API Call with data:', data);
                resolve({ success: true });
            }, 1500);
        });
    }
});
