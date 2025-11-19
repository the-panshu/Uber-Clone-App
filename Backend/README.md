## 1) Register — POST /user/register

Description: Create a new user. Returns a JWT and the created user (password excluded).

Request

- Headers: Content-Type: application/json
- Body:
  - fullname: object
    - firstname (string) — required, min 3 chars
    - lastname (string) — optional, min 3 chars if provided
  - email (string) — required, valid email
  - password (string) — required, min 6 chars

Responses

- 201 Created — { token, user }
- 400 Bad Request — validation errors
- 409 Conflict — duplicate email
- 500 Internal Server Error

Notes

- Password is hashed before save (user.model.hashPassword).
- JWT created with process.env.JWT_SECRET.

---

## 2) Login — POST /user/login

Description: Authenticate user; returns JWT and user object.

Request

- Headers: Content-Type: application/json
- Body:
  - email (string) — required
  - password (string) — required

Responses

- 200 OK — { token, user } (cookie `token` is set)
- 400 Bad Request — validation errors
- 401 Unauthorized — invalid credentials
- 500 Internal Server Error

Notes

- Controller selects `+password` to verify then clears the password before responding.

---

## 3) Profile — GET /user/profile

Description: Get authenticated user's profile.

Request

- Headers:
  - Cookie: token=<jwt> OR
  - Authorization: Bearer <token>

Behavior

- Uses auth middleware to verify JWT and attach user to `req.user`.
- If token is absent/invalid, returns 401 or 400.

Responses

- 200 OK — { user }
  - user is the authenticated user object (password omitted)
- 401 Unauthorized — missing token or blacklisted token
- 400 Bad Request — invalid token
- 500 Internal Server Error

Example cURL (using Authorization header)

```bash
curl -X GET http://localhost:3000/user/profile \
  -H "Authorization: Bearer <token>"
```

---

## 4) Logout — GET /user/logout

Description: Clear client token cookie and blacklist the token server-side.

Request

- Headers:
  - Cookie: token=<jwt> OR
  - Authorization: Bearer <token>

Behavior

- Clears `token` cookie.
- Adds the token to blacklistToken model to prevent reuse.
- Requires a valid token; otherwise returns 401.

Responses

- 200 OK — { message: "Logged out successfully" }
- 401 Unauthorized — missing or revoked token
- 500 Internal Server Error

Example cURL (cookie)

```bash
curl -X GET http://localhost:3000/user/logout \
  -H "Cookie: token=<token>"
```

---

## Error response format (validation)

400 example:

```json
{
  "errors": [
    { "msg": "Invalid email address", "param": "email", "location": "body" }
  ]
}
```

---

In Short Details

- The router validates request input using express-validator in Backend/routes/user.routes.js.
- You can use cookies or Authorization header for auth; logout blacklists token for server-side revocation.
- Consider mapping duplicate key errors to 409 Conflict for better UX.
