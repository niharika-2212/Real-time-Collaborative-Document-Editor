import mongoose from "mongoose";

// creating document schema
const documentSchema = new mongoose.Schema({
  title: { type: String, default: "Untitled Document" },
  content: { type: String, default: "" },
  ownerEmail: { type: String, required: true },
  sharedWith: [{ type: String }],
  lastModified: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const Document = mongoose.model("Document", documentSchema);
export default Document;