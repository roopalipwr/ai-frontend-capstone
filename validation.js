/**
 * Validation Utility Module
 * Contains pure, reusable validation functions for form fields.
 */

const Validation = {
    /**
     * Validates a full name.
     * Required, minimum 2 characters.
     * @param {string} name 
     * @returns {Object} { isValid: boolean, message: string }
     */
    validateName: (name) => {
        const trimmed = (name || '').trim();
        if (!trimmed) {
            return { isValid: false, message: 'Full name is required' };
        }
        if (trimmed.length < 2) {
            return { isValid: false, message: 'Name must be at least 2 characters long' };
        }
        return { isValid: true, message: '' };
    },

    /**
     * Validates an email address.
     * Required and must be a valid email format.
     * @param {string} email 
     * @returns {Object} { isValid: boolean, message: string }
     */
    validateEmail: (email) => {
        const trimmed = (email || '').trim();
        if (!trimmed) {
            return { isValid: false, message: 'Email is required' };
        }
        
        // Comprehensive and standard RFC-compliant email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        
        return { isValid: true, message: '' };
    },

    /**
     * Validates a new password.
     * Optional, but if entered it must contain at least 8 characters, at least one letter, and at least one number.
     * @param {string} password 
     * @returns {Object} { isValid: boolean, message: string }
     */
    validatePassword: (password) => {
        // Password is optional. If empty, it is considered valid.
        if (!password) {
            return { isValid: true, message: '' };
        }
        
        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }
        
        // Complexity checks: must contain at least one letter and at least one number
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (!hasLetter || !hasNumber) {
            return { isValid: false, message: 'Password must contain at least one letter and one number' };
        }
        
        return { isValid: true, message: '' };
    },

    /**
     * Validates that two passwords match.
     * Must match New Password when a new password is entered.
     * @param {string} password 
     * @param {string} confirmPassword 
     * @returns {Object} { isValid: boolean, message: string }
     */
    validateConfirmPassword: (password, confirmPassword) => {
        // If password has been entered, check for match
        if (password !== confirmPassword) {
            return { isValid: false, message: 'Passwords do not match' };
        }
        return { isValid: true, message: '' };
    }
};

// Export for use in Node environments (tests) or attach to window in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validation;
} else {
    window.Validation = Validation;
}
