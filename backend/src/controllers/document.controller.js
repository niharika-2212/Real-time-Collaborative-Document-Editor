import Document from "../models/document.model.js";
export const createDocument = async (req, res) => {
  try {
    // get email from user
    const { email } = req.user;
    // create new document with owneremail
    const doc = new Document({
      ownerEmail: email,
      sharedWith: [],
    });
    await doc.save();
    res.status(201).json({ message: "Document created", doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDocumentsForUser = async (req, res) => {
  try {
    // get email from user
    const { email } = req.user;
    // find all documents where email is present
    const docs = await Document.find({
      $or: [{ ownerEmail: email }, { sharedWith: email }],
    }).sort({ lastModified: -1 }); // sort by lastmodified

    res.status(200).json({ docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    // get email for user
    const { email } = req.user;
    // get id from params
    const { id } = req.params;
    // find doc by id
    const doc = await Document.findById(id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (doc.ownerEmail !== email && !doc.sharedWith.includes(email)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({ doc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { id } = req.params;

    const updatedDoc = await Document.findByIdAndUpdate(
      id,
      { title, content, lastModified: Date.now() },
      { new: true }
    );

    res.status(200).json({ message: "Document updated", doc: updatedDoc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const shareDocument = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Avoid duplicates
    if (!doc.sharedWith.includes(email)) {
      doc.sharedWith.push(email);
      await doc.save();
    }

    res.status(200).json({ message: "Document shared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};