// routes/documentRoutes.js
import express from "express";
import  verifyFirebaseToken  from "../middlewares/auth.js";
import { createDocument, getDocumentsForUser, getDocumentById, updateDocument,shareDocument } from "../controllers/document.controller.js";
const router = express.Router();

router.post("/create", verifyFirebaseToken, createDocument);
router.get("/all", verifyFirebaseToken, getDocumentsForUser);
router.get("/:id", verifyFirebaseToken, getDocumentById);
router.put("/:id", verifyFirebaseToken, updateDocument);
router.put('/:id/share', verifyFirebaseToken, shareDocument);
export default router;