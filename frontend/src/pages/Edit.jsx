import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import { io } from "socket.io-client";
import "../styles/Edit.css";

function Edit() {
  const { id } = useParams();
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingStatus, setSavingStatus] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const socketRef = useRef(null);
  const contentRef = useRef(content);
  const isRemoteChange = useRef(false);
  const sendChangesTimeout = useRef(null);

  // Keep contentRef updated
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Fetch document on load
  useEffect(() => {
    async function fetchDocument() {
      try {
        const res = await axios.get(`http://localhost:5000/document/${id}`);
        setTitle(res.data.doc.title);
        setContent(res.data.doc.content);
        contentRef.current = res.data.doc.content;
        setHasAccess(true); // Reset in case they got access

      } catch (err) {
        console.error("Error loading document:", err);
        if (err.response && err.response.status === 403) {
          setHasAccess(false);
        } else if (err.response && err.response.status === 404) {
          setHasAccess(false);
        }
      }
    }

    if (token) {
      fetchDocument();
    }
  }, [id, token]);

  // Setup Socket.IO connection
  useEffect(() => {
    if (!token) return;

    socketRef.current = io("http://localhost:5000");
    // join room for document
    socketRef.current.emit("join-document", id);
    // load document from socket if not same
    socketRef.current.on("load-document", (docContent) => {
      if (docContent !== contentRef.current) {
        isRemoteChange.current = true;
        setContent(docContent);
      }
    });
    // get changes from socket (done by others)
    socketRef.current.on("receive-changes", (newContent) => {
      if (newContent !== contentRef.current) {
        isRemoteChange.current = true;
        setContent(newContent);
      }
    });

    return () => {
      // disconnect
      socketRef.current.disconnect();
    };
  }, [id, token]);

  // Emit changes 
  useEffect(() => {
    // emit change if done by user
    if (!socketRef.current || isRemoteChange.current) {
      isRemoteChange.current = false;
      return;
    }

    if (sendChangesTimeout.current) clearTimeout(sendChangesTimeout.current);
    // autoemit after some interval
    sendChangesTimeout.current = setTimeout(() => {
      socketRef.current.emit("send-changes", {
        docId: id,
        content,
      });
    }, 300);
  }, [content, id]);


  // Auto-save via REST directly to mongodb
  useEffect(() => {
    if (!token) return;

    const timeout = setTimeout(async () => {
      try {
        setSaving(true);
        setSavingStatus("Saving...");
        await axios.put(`http://localhost:5000/document/${id}`, {
          title,
          content,
        });
        setSavingStatus("Saved");
      } catch (err) {
        console.error("Save failed", err);
        setSavingStatus("Failed to save");
      } finally {
        setSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, content, id, token]);

  // Handle sharing email
  const handleShare = async () => {
    if (!shareEmail.trim()) return;

    try {
      await axios.put(
        `http://localhost:5000/document/${id}/share`,
        { email: shareEmail.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Document shared with ${shareEmail}`);
      setShareEmail("");
    } catch (err) {
      console.error("Failed to share document", err);
      alert("Failed to share document");
    }
  };

  return (
    <div className="edit">
      <Navbar />
      {(!hasAccess) ?
        <div className="no-access">You do not have access to this document</div> :
        <div className="main-container">
          <div
            className="saving-doc"
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: saving ? "#C84B31" : "#346751",
            }}
          >
            {savingStatus}
          </div>

          <div className="sharing">
            <input
              type="email"
              placeholder="email"
              name="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="share-input"
            />
            <button className="green-button" onClick={handleShare}>
              Share
            </button>
          </div>

          <input
            className="title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Document"
          />

          <div className="edit-container">
            <textarea
              className="text-editor"
              value={content}
              rows={10}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing here..."
            />
          </div>
        </div>
      }
    </div>
  );
}

export default Edit;
