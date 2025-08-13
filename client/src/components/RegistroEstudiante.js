import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const RegistroEstudiante = () => {
  const [estudiante, setEstudiante] = useState({
    nombre: '',
    apellido: '',
    materia: '',
    nota_1p: '',
    nota_2p: '',
    promedio: '0.00'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEstudiante(prev => {
      const newEstudiante = { ...prev, [name]: value };
      
      // Si son campos de nota, recalcular promedio
      if (name === 'nota_1p' || name === 'nota_2p') {
        const nota1 = parseFloat(newEstudiante.nota_1p) || 0;
        const nota2 = parseFloat(newEstudiante.nota_2p) || 0;
        const promedio = ((nota1 + nota2) / 2).toFixed(2);
        newEstudiante.promedio = promedio;
      }
      
      return newEstudiante;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!estudiante.nombre || !estudiante.apellido || !estudiante.materia || estudiante.nota_1p === '' || estudiante.nota_2p === '') {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }
    
    const nota1 = parseFloat(estudiante.nota_1p);
    const nota2 = parseFloat(estudiante.nota_2p);
    
    if (isNaN(nota1) || isNaN(nota2) || nota1 < 0 || nota1 > 20 || nota2 < 0 || nota2 > 20) {
      Swal.fire('Error', 'Las notas deben ser números entre 0 y 20', 'error');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/estudiantes', estudiante);
      Swal.fire('Éxito', 'Estudiante registrado correctamente', 'success');
      // Limpiar el formulario
      setEstudiante({
        nombre: '',
        apellido: '',
        materia: '',
        nota_1p: '',
        nota_2p: '',
        promedio: '0.00'
      });
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Hubo un problema al registrar el estudiante', 'error');
    }
  };

  return (
    <div>
      <h2>Registro de Estudiantes</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input 
            type="text" 
            className="form-control" 
            name="nombre" 
            value={estudiante.nombre} 
            onChange={handleChange} 
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input 
            type="text" 
            className="form-control" 
            name="apellido" 
            value={estudiante.apellido} 
            onChange={handleChange} 
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Materia</label>
          <input 
            type="text" 
            className="form-control" 
            name="materia" 
            value={estudiante.materia} 
            onChange={handleChange} 
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nota Primer Parcial (0-20)</label>
          <input 
            type="number" 
            className="form-control" 
            name="nota_1p" 
            value={estudiante.nota_1p} 
            onChange={handleChange} 
            step="0.01"
            min="0"
            max="20"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nota Segundo Parcial (0-20)</label>
          <input 
            type="number" 
            className="form-control" 
            name="nota_2p" 
            value={estudiante.nota_2p} 
            onChange={handleChange} 
            step="0.01"
            min="0"
            max="20"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Promedio</label>
          <input 
            type="text" 
            className="form-control" 
            name="promedio" 
            value={estudiante.promedio} 
            readOnly
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrar Estudiante</button>
      </form>
    </div>
  );
};

export default RegistroEstudiante;