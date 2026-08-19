const test = require('node:test');
const assert = require('node:assert/strict');

const Validation = require('./validation.js');

test('rejects an empty name', () => {
    const result = Validation.validateName('');
    assert.equal(result.isValid, false);
});

test('rejects a one-character name', () => {
    const result = Validation.validateName('A');
    assert.equal(result.isValid, false);
});

test('accepts a valid full name', () => {
    const result = Validation.validateName('Roopali Pawar');
    assert.equal(result.isValid, true);
});

test('rejects an empty email', () => {
    const result = Validation.validateEmail('');
    assert.equal(result.isValid, false);
});

test('rejects an invalid email', () => {
    const result = Validation.validateEmail('roopali@');
    assert.equal(result.isValid, false);
});

test('accepts a valid email', () => {
    const result = Validation.validateEmail('roopali@example.com');
    assert.equal(result.isValid, true);
});

test('rejects a short password', () => {
    const result = Validation.validatePassword('abc12');
    assert.equal(result.isValid, false);
});

test('rejects a password without a number', () => {
    const result = Validation.validatePassword('abcdefgh');
    assert.equal(result.isValid, false);
});

test('accepts a valid password', () => {
    const result = Validation.validatePassword('abcde123');
    assert.equal(result.isValid, true);
});

test('rejects mismatched passwords', () => {
    const result = Validation.validateConfirmPassword(
        'abcde123',
        'different123'
    );
    assert.equal(result.isValid, false);
});

test('accepts matching passwords', () => {
    const result = Validation.validateConfirmPassword(
        'abcde123',
        'abcde123'
    );
    assert.equal(result.isValid, true);
});