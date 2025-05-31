#!/bin/bash

# GET /
curl -X GET http://localhost:3000/

# GET /json
curl -X GET http://localhost:3000/json

# GET /params/your-name
curl -X GET http://localhost:3000/params/your-name

# GET /query?name=your-name
curl -X GET "http://localhost:3000/query?name=your-name"

# POST /users
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'

# PUT /users/123
curl -X PUT http://localhost:3000/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'

# PATCH /users/123
curl -X PATCH http://localhost:3000/users/123 \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'

# DELETE /users/123
curl -X DELETE http://localhost:3000/users/123