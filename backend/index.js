import express from 'express'; 
import cors from 'cors';
import { connectdb } from './src/lib/db.js'; // import connectdb function to connect to mongodb
import userRoutes from './src/routes/user.routes.js'; // import user routes
import documentRoutes from './src/routes/document.routes.js'; // import document routes
import http from "http";
import { Server } from "socket.io";
import Document from './src/models/document.model.js';

const app = express(); 
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API
app.use("/user", userRoutes);
app.use("/document", documentRoutes)

// socket io integration
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" }, 
});
io.on("connection", (socket) => {

  // console.log("User connected:", socket.id);

  // Join a room for the document ID
  socket.on("join-document", async (docId) => {
    socket.join(docId);
    // console.log(`Socket ${socket.id} joined room ${docId}`);

    // Send current document content to the new client
    try {
      const document = await Document.findById(docId);
      if (document) {
        socket.emit("load-document", document.content);
      } else {
        socket.emit("load-document", "");
      }
    } catch (err) {
      console.error("Error loading document:", err);
      socket.emit("load-document", "");
    }
  });

  // Listen for changes from client and broadcast to others
  socket.on("send-changes", ({ docId, content }) => {
    socket.to(docId).emit("receive-changes", content);
  });
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectdb(); // call connectdb function to connect to mongodb
});
