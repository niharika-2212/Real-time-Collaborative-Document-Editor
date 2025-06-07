import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Edit from "./pages/Edit.jsx";
function App() {
  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/edit/:id" element={<Edit/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
