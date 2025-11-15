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

  ```json
  {
    "errors": [
      {
        "msg": "Invalid email address",
        "param": "email",
        "location": "body"
      }
    ]
  }
  ```

- 409 Conflict (recommended)

  - If the email already exists (unique constraint). Your current controller does not explicitly handle this; typical behaviour is a database duplicate key error. Consider updating controller to return 409 for duplicate email.

- 500 Internal Server Error
  - For unhandled server/database errors.

## Notes

- Password is hashed before saving; the JWT secret is determined by `process.env.JWT_SECRET`.
- `fullname.lastname` is optional.
- Add try/catch in controller to map database errors (like duplicate email) to proper 4xx responses for better UX.

## Example cURL

```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {"firstname":"Alice","lastname":"Smith"},
    "email":"alice@example.com",
    "password":"supersecret"
  }'
```
