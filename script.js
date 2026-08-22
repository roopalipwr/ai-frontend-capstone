document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const feedbackEl = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('submit-btn');
    const themeSelect = document.getElementById('theme');

    /**
     * Applies the selected theme to the document.
     * @param {string} theme 'light' | 'dark' | 'system'
     */
    const applyTheme = (theme) => {
        if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
    };

    // Real-time system theme change detection
    const systemMedia = window.matchMedia('(prefers-color-scheme: dark)');
    systemMedia.addEventListener('change', () => {
        if (themeSelect.value === 'system') {
            applyTheme('system');
        }
    });

    // Theme selector change listener
    themeSelect.addEventListener('change', () => {
        applyTheme(themeSelect.value);
    });

    /**
     * Updates visual feedback for a field.
     * @param {HTMLElement} inputREPLACE ALL
     * @param {Object} result { isValid, message }
     */
    const updateFieldFeedback = (input, result) => {
        const errorEl = document.getElementById(`${input.id}-error`);
        if (!result.isValid) {
            input.classList.add('invalid');
            input.setAttribute('aria-invalid', 'true');
            if (errorEl) {
                errorEl.textContent = result.message;
            }
        } else {
            input.classList.remove('invalid');
            input.removeAttribute('aria-invalid');
            if (errorEl) {
                errorEl.textContent = '';
            }
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
        // Re-validate confirm password if:
        // 1. Confirm password has been typed
        // 2. Both password fields are completely empty (clearing errors)
        // 3. Confirm password currently displays an invalid mismatch error
        const hasConfirmError = confirmPasswordInput.classList.contains('invalid');
        if (confirmPasswordInput.value || (!passwordInput.value && !confirmPasswordInput.value) || hasConfirmError) {
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

        // Run all field validations
        const nameResult = window.Validation.validateName(fullNameInput.value);
        const emailResult = window.Validation.validateEmail(emailInput.value);
        const passwordResult = window.Validation.validatePassword(passwordInput.value);
        const confirmResult = window.Validation.validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);

        // Update all inline validation feedback
        updateFieldFeedback(fullNameInput, nameResult);
        updateFieldFeedback(emailInput, emailResult);
        updateFieldFeedback(passwordInput, passwordResult);
        updateFieldFeedback(confirmPasswordInput, confirmResult);

        const isFormValid = nameResult.isValid && emailResult.isValid &&
                            passwordResult.isValid && confirmResult.isValid;

        if (!isFormValid) {
            showFeedback('Please correct the errors before saving.', 'error');
            
            // Focus the first invalid input element
            const firstError = form.querySelector('.invalid');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        // Simulate network API save call
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
        feedbackEl.style.display = ''; // Reset display style
        
        // Auto-hide success message after 5 seconds to match good UX standard
        if (type === 'success') {
            setTimeout(() => {
                feedbackEl.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Clears all validation errors and inline warnings.
     */
    function clearValidationState() {
        const inputs = [fullNameInput, emailInput, passwordInput, confirmPasswordInput];
        inputs.forEach(input => {
            input.classList.remove('invalid');
            input.removeAttribute('aria-invalid');
            const errorEl = document.getElementById(`${input.id}-error`);
            if (errorEl) {
                errorEl.textContent = '';
            }
        });
        feedbackEl.style.display = 'none';
        feedbackEl.textContent = '';
    }

    /**
     * Custom Form Reset Handling
     * Restores the form fields to their last saved state (or HTML defaults) and wipes validation states.
     */
    form.addEventListener('reset', (e) => {
        e.preventDefault();
        
        // Wipe all error classes, messages and form feedbacks
        clearValidationState();
        
        // Pull latest saved settings to restore them, or fall back to HTML defaults
        const saved = localStorage.getItem('capstone-settings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                fullNameInput.value = data.fullName || '';
                emailInput.value = data.email || '';
                document.getElementById('bio').value = data.bio || '';
                passwordInput.value = '';
                confirmPasswordInput.value = '';
                form.emailNotifications.checked = !!data.emailNotifications;
                form.pushNotifications.checked = !!data.pushNotifications;
                themeSelect.value = data.theme || 'light';
            } catch (err) {
                console.error('Failed to parse saved settings on reset:', err);
                form.reset(); // Native fallback
            }
        } else {
            // No localStorage saved, restore plain HTML baseline defaults
            fullNameInput.value = '';
            emailInput.value = '';
            document.getElementById('bio').value = '';
            passwordInput.value = '';
            confirmPasswordInput.value = '';
            form.emailNotifications.checked = true; // checked by default in HTML
            form.pushNotifications.checked = false; // unchecked by default in HTML
            themeSelect.value = 'light';
        }
        
        // Keep the visual theme in sync with the active theme select dropdown
        applyTheme(themeSelect.value);
    });

    /**
     * Sets the form saving/loading state on the primary button.
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
     * Simulates an asynchronous API network save call and stores the settings in localStorage.
     * @param {FormData} formData 
     * @returns {Promise}
     */
    function simulateApiCall(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = {};
                formData.forEach((value, key) => {
                    if (key === 'emailNotifications' || key === 'pushNotifications') {
                        data[key] = value === 'on';
                    } else {
                        data[key] = value;
                    }
                });
                
                // Ensure correct capture of checkbox states
                data.emailNotifications = form.emailNotifications.checked;
                data.pushNotifications = form.pushNotifications.checked;

                console.log('Simulated API Call completed with data:', data);
                
                // Persist settings locally
                localStorage.setItem('capstone-settings', JSON.stringify(data));
                
                resolve({ success: true });
            }, 1500);
        });
    }

    /**
     * Loads saved settings from localStorage and applies theme on startup.
     */
    function loadSavedSettings() {
        const saved = localStorage.getItem('capstone-settings');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                
                if (data.fullName) fullNameInput.value = data.fullName;
                if (data.email) emailInput.value = data.email;
                if (data.bio) document.getElementById('bio').value = data.bio;
                
                // Passwords are left unpopulated for standard privacy/security protocols
                passwordInput.value = '';
                confirmPasswordInput.value = '';
                
                form.emailNotifications.checked = !!data.emailNotifications;
                form.pushNotifications.checked = !!data.pushNotifications;
                
                if (data.theme) {
                    themeSelect.value = data.theme;
                }
            } catch (e) {
                console.error('Failed to parse saved settings on load:', e);
            }
        }
        
        // Immediately enforce the current active theme
        applyTheme(themeSelect.value);
    }

    // Run startup settings configuration loader
    loadSavedSettings();
});
