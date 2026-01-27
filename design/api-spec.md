# API Specification – StudyTrack Pro

## Base URL
```bash
http://localhost:5000/api
```

## Authentication APIs

### 1. Register User
- **Endpoint**: `/auth/register`
- **Method**: POST
- **Description**: Register a new user

**Request Body**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201)**
```json
{
  "message": "User registered successfully"
}
```

### 2.Login User 
- **Endpoint**: `/auth/login`
- **Method**: POST
- **Description**: Authenticate user and return JWT token

**Request Body**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200)**
```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": number,
    "name": "string",
    "email": "string"
  }
}
```
**Record APIs (JWT Required)**

- **Authorization Header**
```bash
Authorization: Bearer JWT_TOKEN
```

### 3. Get All Records
- **Endpoint**: `/records`
- **Method**: GET
- **Description**: Get all records for the logged-in user

**Response (200)**
```json
[
  {
    "id": number,
    "title": "string",
    "category": "string",
    "duration": number,
    "memo": "string",
    "record_date": "YYYY-MM-DD"
  }
]

```

### 4. Create Record
- **Endpoint**: `/records`
- **Method**: POST
- **Description**: Create a new record for the logged-in user

**Request Body**
```json
{
  "title": "string",
  "category": "string",
  "duration": number,
  "memo": "string",
  "record_date": "YYYY-MM-DD"
}
```

**Response (201)**
```json
{
  "message": "Record created successfully"
}
```

  "title": "string",
  "category": "string",
  "duration": number,
  "memo": "string",
  "record_date": "YYYY-MM-DD"
}
```

**Response (200)**
```json
{
  "message": "Record updated successfully"
}
``` 

### 6. Delete Record
- **Endpoint**: `/records/:id`
- **Method**: DELETE
- **Description**: Delete a record for the logged-in user

**Response (200)**
```json
{
  "message": "Record deleted successfully"
}
```

### 7. Logout User
- **Endpoint**: `/auth/logout`
- **Method**: POST
- **Description**: Logout the user and remove JWT token

**Response (200)**
```json
{
  "message": "Logout successful"
}
```


