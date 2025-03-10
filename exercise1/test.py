import datetime

# Function to greet the user and print the current date and time
def greet_user():
    try:
        # Print "Hello, World!" to the console
        print("Hello, World!")

        # Ask for the user's name and store it
        user_name = input("Please enter your name: ")

        # Check if the user entered a valid name (non-empty)
        if not user_name.strip():
            raise ValueError("Name cannot be empty. Please provide a valid name.")

        # Greet the user by name
        print(f"Hello, {user_name}!")

        # Get the current date and time
        current_datetime = datetime.datetime.now()

        # Print the current date and time
        print("Current date and time:", current_datetime.strftime("%Y-%m-%d %H:%M:%S"))

    except ValueError as e:
        # Handle error if the user does not input a valid name
        print(f"Error: {e}")
    except Exception as e:
        # Handle any other unexpected errors
        print(f"Unexpected error: {e}")

# Call the function to execute the program
greet_user()
