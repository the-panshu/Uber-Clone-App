# User Registration Endpoint

Endpoint: POST /user/register  
Description: Creates a new user account, returns a JWT token and the created user (without password).

## Request

- Headers:
  - Content-Type: application/json
- Body (JSON):
  - fullname: object
    - firstname (string) — required, minimum 3 characters
    - lastname (string) — optional, minimum 3 characters if provided
  - email (string) — required, must be a valid email
  - password (string) — required, minimum 6 characters

Example request body:

```json
{
  "fullname": {
    "firstname": "Alice",
    "lastname": "Smith"
  },
  "email": "alice@example.com",
  "password": "supersecret"
}
```

## Validation rules

- `email` must be a valid email (express-validator)
- `fullname.firstname` minimum length 3 (express-validator and schema)
- `password` minimum length 6 (express-validator)
- Model also enforces `email` uniqueness and `password` is required

## Responses / Status codes

- 201 Created

  - Body: JSON with `token` (JWT) and `user` object (created user, password not returned)
  - Example:

  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "6428b06e1a7b2c3d4e5f6a7b",
      "fullname": {
        "firstname": "Alice",
        "lastname": "Smith"
      },
      "email": "alice@example.com",
      "socketId": null,
      "createdAt": "2025-11-15T00:00:00.000Z",
      "updatedAt": "2025-11-15T00:00:00.000Z"
    }
  }
  ```

- 400 Bad Request

  - When validation fails. Response shape:

- 409 Conflict (recommended)

  - If the email already exists (unique constraint). Your current controller does not explicitly handle this; typical behaviour is a database duplicate key error. Consider updating controller to return 409 for duplicate email.

- 500 Internal Server Error
  - For unhandled server/database errors.

# User Login Endpoint

- Endpoint: POST /users/login
- Description: Authenticates an existing user. Returns a JWT token and the authenticated user object.

### Request

- Headers:
  - Content-Type: application/json
- Body (JSON):
  - email (string) — required, must be a valid email
  - password (string) — required, minimum 6 characters

Example request body:

```json
{
  "email": "alice@example.com",
  "password": "supersecret"
}
```

# User API (Auth)

Concise, professional documentation for the user registration and login endpoints.

## Base routes

- Register: POST /user/register (router base may be `/user` or `/users` depending on mount)
- Login: POST /user/login

Adjust prefix if your router is mounted under `/users` instead of `/user`.

---

## 1) Register — POST /user/register

Description: Create a new user. Returns a JSON web token and the created user (password excluded).

Request:

- Headers: Content-Type: application/json
- Body JSON:
  - fullname: object
    - firstname (string) — required, min 3 chars
    - lastname (string) — optional, min 3 chars if provided
  - email (string) — required, valid email
  - password (string) — required, min 6 chars

Example:

```json
{
  "fullname": { "firstname": "Alice", "lastname": "Smith" },
  "email": "alice@example.com",
  "password": "supersecret"
}
```
