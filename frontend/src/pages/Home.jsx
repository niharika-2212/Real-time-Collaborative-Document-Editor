import React,{useEffect} from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Home.css";
function Home() {
  const [documents, setDocuments] = React.useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await axios.get("http://localhost:5000/document/all");
        setDocuments(res.data.docs);
      } catch (err) {
        console.error("Error fetching documents:", err);
      }
    }

    fetchDocs();
  }, []);
  const handleCreate = async () => {
    try {
      const res = await axios.post("http://localhost:5000/document/create");
      const docId = res.data.doc._id;
      navigate(`/edit/${docId}`);
    } catch (err) {
      console.error("Error creating document:", err);
    }
  };
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <div className="home-block">
          <div className="white-button" onClick={handleCreate}>New Document</div>
          <div className="list-docs">
            {documents.map((doc) => (
              <div className="doc" key={doc._id} onClick={() => navigate(`/edit/${doc._id}`)}>
                {doc.title || "Untitled Document"}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;