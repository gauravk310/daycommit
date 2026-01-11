# DayCommit Server

Backend server for the DayCommit application using Express.js and MongoDB.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string:
     - For local MongoDB: `mongodb://localhost:27017/daycommit`
     - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/daycommit?retryWrites=true&w=majority`

3. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Entries

- **GET** `/api/entries/:userId` - Get all entries for a user
- **GET** `/api/entries/:userId/stats` - Get user statistics
- **GET** `/api/entries/:userId/:date` - Get entry by date
- **POST** `/api/entries` - Create a new entry
- **PUT** `/api/entries/:id` - Update an entry
- **DELETE** `/api/entries/:id` - Delete an entry

### Health Check

- **GET** `/api/health` - Check server status

## Request/Response Examples

### Create Entry
```json
POST /api/entries
{
  "userId": "user123",
  "date": "2026-01-11",
  "status": "complete",
  "description": "Built new feature",
  "achievement": "8 hours of work",
  "duration": 480
}
```

### Response
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "user123",
    "date": "2026-01-11",
    "status": "complete",
    "description": "Built new feature",
    "achievement": "8 hours of work",
    "duration": 480,
    "createdAt": "2026-01-11T00:00:00.000Z",
    "updatedAt": "2026-01-11T00:00:00.000Z"
  }
}
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string

## Database Schema

### DayEntry
- `userId` (String, required) - User identifier
- `date` (String, required) - Date in YYYY-MM-DD format
- `status` (String, required) - Entry status: 'none', 'partial', or 'complete'
- `description` (String, required) - Entry description
- `achievement` (String, required) - Achievement details
- `duration` (Number, optional) - Duration in minutes
- `createdAt` (Date) - Auto-generated
- `updatedAt` (Date) - Auto-generated

**Note:** The combination of `userId` and `date` is unique, ensuring one entry per user per day.
