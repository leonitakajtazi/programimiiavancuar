import pytest
from validate_user_data import validate_user_data  # Import your function here

# Valid data tests
def test_valid_data():
    user_data = {
        "username": "user123",
        "email": "user@example.com",
        "password": "Password123!",
        "age": 25,
        "referral_code": "ABCDEFGH"
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == True
    assert result["errors"] == {}  # Check that errors is an empty dictionary


# Invalid username tests
def test_invalid_username_missing():
    user_data = {
        "username": "",
        "email": "user@example.com",
        "password": "Password123!",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "username" in result["errors"]

def test_invalid_username_length():
    user_data = {
        "username": "us",
        "email": "user@example.com",
        "password": "Password123!",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "username" in result["errors"]

def test_invalid_username_format():
    user_data = {
        "username": "user!@#",
        "email": "user@example.com",
        "password": "Password123!",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "username" in result["errors"]

# Invalid email tests
def test_invalid_email_missing():
    user_data = {
        "username": "user123",
        "email": "",
        "password": "Password123!",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "email" in result["errors"]

def test_invalid_email_format():
    user_data = {
        "username": "user123",
        "email": "invalid-email",
        "password": "Password123!",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "email" in result["errors"]

# Invalid password tests
def test_invalid_password_missing():
    user_data = {
        "username": "user123",
        "email": "user@example.com",
        "password": "",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "password" in result["errors"]

def test_invalid_password_length():
    user_data = {
        "username": "user123",
        "email": "user@example.com",
        "password": "short",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "password" in result["errors"]

def test_invalid_password_number():
    user_data = {
        "username": "user123",
        "email": "user@example.com",
        "password": "Password!",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "password" in result["errors"]

def test_invalid_password_special_char():
    user_data = {
        "username": "user123",
        "email": "user@example.com",
        "password": "Password123",
        "age": 25
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "password" in result["errors"]

# Invalid age tests
def test_invalid_age_type():
    user_data = {
        "username": "user123",
        "email": "user@example.com",
        "password": "Password123!",
        "age": "twenty-five"
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "age" in result["errors"]

def test_invalid_age_under_18():
    user_data = {
        "username": "user123",
        "email": "user@example.com",
        "password": "Password123!",
        "age": 16
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "age" in result["errors"]

# Invalid referral code tests
def test_invalid_referral_code_type():
    user_data = {
        "username": "user123",
        "email": "user@example.com",
        "password": "Password123!",
        "age": 25,
        "referral_code": 12345678
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "referral_code" in result["errors"]

def test_invalid_referral_code_length():
    user_data = {
        "username": "user123",
        "email": "user@example.com",
        "password": "Password123!",
        "age": 25,
        "referral_code": "short"
    }
    result = validate_user_data(user_data)
    assert result["is_valid"] == False
    assert "referral_code" in result["errors"]
