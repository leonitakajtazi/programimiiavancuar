const validateUserData = require('./validateUserData'); // Rrugën e saktë në projektin tuaj

describe('validateUserData', () => {
    test('validates correct user data', () => {
        const validUserData = {
            username: "John_Doe123",
            email: "john.doe@example.com",
            password: "Password1@",
            age: 25,
            referralCode: "ABCDEFGH"
        };

        const result = validateUserData(validUserData);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
    });

    test('invalid username', () => {
        const invalidUserData = {
            username: "ab",
            email: "john.doe@example.com",
            password: "Password1@"
        };

        const result = validateUserData(invalidUserData);
        expect(result.isValid).toBe(false);
        expect(result.errors.username).toBe("Username must be between 3 and 20 characters");
    });

    test('invalid email format', () => {
        const invalidUserData = {
            username: "John_Doe123",
            email: "invalid-email",
            password: "Password1@"
        };

        const result = validateUserData(invalidUserData);
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBe("Invalid email format");
    });

    test('invalid password without number', () => {
        const invalidUserData = {
            username: "John_Doe123",
            email: "john.doe@example.com",
            password: "Password@"
        };

        const result = validateUserData(invalidUserData);
        expect(result.isValid).toBe(false);
        expect(result.errors.password).toBe("Password must contain at least one number");
    });

    test('invalid age under 18', () => {
        const invalidUserData = {
            username: "John_Doe123",
            email: "john.doe@example.com",
            password: "Password1@",
            age: 16
        };

        const result = validateUserData(invalidUserData);
        expect(result.isValid).toBe(false);
        expect(result.errors.age).toBe("User must be at least 18 years old");
    });

    test('invalid referral code length', () => {
        const invalidUserData = {
            username: "John_Doe123",
            email: "john.doe@example.com",
            password: "Password1@",
            referralCode: "ABCDE"
        };

        const result = validateUserData(invalidUserData);
        expect(result.isValid).toBe(false);
        expect(result.errors.referralCode).toBe("Referral code must be exactly 8 characters");
    });
});
