/**
 * Validation Utility Module
 */

const Validation = {
    /**
     * Validates an email address.
     * @param {string} email 
     * @returns {Object} { isValid: boolean, message: string }
     */
    validateEmail: (email) => {
        if (!email) return { isValid: false, message: 'Email is required' };
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        
        return { isValid: true, message: '' };
    },

    /**
     * Validates a full name.
     * @param {string} name 
     * @returns {Object} { isValid: boolean, message: string }
     */
    validateName: (name) => {
        if (!name) return { isValid: false, message: 'Full name is required' };
        if (name.trim().length < 2) {
            return { isValid: false, message: 'Name must be at least 2 characters long' };
        }
        return { isValid: true, message: '' };
    },

    /**
     * Validates a password.
     * @param {string} password 
     * @returns {Object} { isValid: boolean, message: string }
     */
    validatePassword: (password) => {
        if (!password) return { isValid: true, message: '' }; // Optional if empty
        
        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }
        
        // Basic complexity check: at least one number and one letter
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        
        if (!hasLetter || !hasNumber) {
            return { isValid: false, message: 'Password must contain at least one letter and one number' };
        }
        
        return { isValid: true, message: '' };
    },

    /**
     * Validates that two passwords match.
     * @param {string} password 
     * @param {string} confirmPassword 
     * @returns {Object} { isValid: boolean, message: string }
     */
    validateConfirmPassword: (password, confirmPassword) => {
        if (password !== confirmPassword) {
            return { isValid: false, message: 'Passwords do not match' };
        }
        return { isValid: true, message: '' };
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validation;
} else {
    window.Validation = Validation;
}
