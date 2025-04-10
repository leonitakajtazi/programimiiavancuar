Product Management API with Supabase Integration
Overview
A RESTful API built with Express.js and Supabase for managing products. The API supports basic CRUD operations: Create, Read, Update, and Delete products.

Setup
1. Install Dependencies
Make sure you have Node.js installed.

Install required packages:

2. Configure Supabase
Create a project on Supabase.

Create a products table with these fields: id, name, price, description.

Get your Supabase URL and API Key from the Supabase dashboard.

3. Set up the Server
In server.js, set up the connection to Supabase:
node server.js

API Endpoints
1. GET /api/products
Description: Get all products.

Example Response:
[{ "id": 1, "name": "Product 1", "price": 100, "description": "Great product" }]

2. GET /api/products/:id
Description: Get a product by ID.

Example Response:
{ "id": 1, "name": "Product 1", "price": 100, "description": "Great product" }

3. POST /api/products
Description: Add a new product.

Request Body:
{ "name": "New Product", "price": 150, "description": "Awesome product" }
Example Response:
{ "id": 3, "name": "New Product", "price": 150, "description": "Awesome product" }

4. PUT /api/products/:id
Description: Update a product.

Request Body:
{ "name": "Updated Product", "price": 200 }

Example Response:

5. DELETE /api/products/:id
Description: Delete a product by ID.
Example Response: 204 No Content (No body).