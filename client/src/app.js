import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './components/Inicio';
import RegistroEstudiante from './components/RegistroEstudiante';
import GestionEstudiantes from './components/GestionEstudiantes';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registro" element={<RegistroEstudiante />} />
          <Route path="/gestion" element={<GestionEstudiantes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;