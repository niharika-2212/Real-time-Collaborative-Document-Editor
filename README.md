# Real-time Collaborative Document Editor
A web-based real-time collaborative editor. Users can create, edit, and share documents with others — and collaborate in real time.

## Features
- Authentication
- Create, edit and share documents
- Real-time collaboration

## Tech-Stack
### Frontend
- React
- Socket.IO client
- Firebase Auth
- Axios

### Backend
- Express
- MongoDB
- Socket.IO server
- Firebase Admin SDK

## Setup Instructions
### Backend
1. Clone repository and navigate to backend
```
git clone ""
cd backend
npm install
```
2. Setup environment variables env
```
PORT=<port>
MONGODB_URI=<your URI>
```

3. Get firebase project config file and paste in `lib` as `firebase.json`

4. Start the server
```
npm run dev
```
### Frontend
1. Navigate to frontend
```
cd frontend
npm install
```

2. Get firebase config details for frontend
3. Create a file `firebase.js` in `src` and save the details
4. Start the frontend server
```
npm run dev
```
Visit your localhost link as shown in your terminal

## Author
Niharika Manhar

