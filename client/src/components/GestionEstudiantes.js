import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const GestionEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    materia: '',
    nota_1p: '',
    nota_2p: '',
    promedio: '0.00'
  });

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/estudiantes');
      setEstudiantes(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los estudiantes', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const newForm = { ...prev, [name]: value };
      
      if (name === 'nota_1p' || name === 'nota_2p') {
        const nota1 = parseFloat(newForm.nota_1p) || 0;
        const nota2 = parseFloat(newForm.nota_2p) || 0;
        const promedio = ((nota1 + nota2) / 2).toFixed(2);
        newForm.promedio = promedio;
      }
      
      return newForm;
    });
  };

  const iniciarEdicion = (estudiante) => {
    setEditando(estudiante.id);
    setForm({
      nombre: estudiante.nombre,
      apellido: estudiante.apellido,
      materia: estudiante.materia,
      nota_1p: estudiante.nota_1p,
      nota_2p: estudiante.nota_2p,
      promedio: estudiante.promedio
    });
  };

  const cancelarEdicion = () => {
    setEditando(null);
    setForm({
      nombre: '',
      apellido: '',
      materia: '',
      nota_1p: '',
      nota_2p: '',
      promedio: '0.00'
    });
  };

  const actualizarEstudiante = async (id) => {
    // Validaciones
    if (!form.nombre || !form.apellido || !form.materia || form.nota_1p === '' || form.nota_2p === '') {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }
    
    const nota1 = parseFloat(form.nota_1p);
    const nota2 = parseFloat(form.nota_2p);
    
    if (isNaN(nota1) || isNaN(nota2) || nota1 < 0 || nota1 > 20 || nota2 < 0 || nota2 > 20) {
      Swal.fire('Error', 'Las notas deben ser números entre 0 y 20', 'error');
      return;
    }
    
    try {
      await axios.put(`http://localhost:5000/estudiantes/${id}`, form);
      Swal.fire('Éxito', 'Estudiante actualizado correctamente', 'success');
      cargarEstudiantes();
      cancelarEdicion();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Hubo un problema al actualizar el estudiante', 'error');
    }
  };

  const eliminarEstudiante = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/estudiantes/${id}`);
          Swal.fire('Eliminado!', 'El estudiante ha sido eliminado.', 'success');
          cargarEstudiantes();
        } catch (error) {
          console.error(error);
          Swal.fire('Error', 'Hubo un problema al eliminar el estudiante', 'error');
        }
      }
    });
  };

  return (
    <div>
      <h2>Gestión de Estudiantes</h2>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Materia</th>
            <th>Nota 1P</th>
            <th>Nota 2P</th>
            <th>Promedio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map(estudiante => (
            editando === estudiante.id ? (
              <tr key={estudiante.id} className="table-warning">
                <td>{estudiante.id}</td>
                <td>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="nombre" 
                    value={form.nombre} 
                    onChange={handleChange} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="apellido" 
                    value={form.apellido} 
                    onChange={handleChange} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="materia" 
                    value={form.materia} 
                    onChange={handleChange} 
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="nota_1p" 
                    value={form.nota_1p} 
                    onChange={handleChange} 
                    step="0.01"
                    min="0"
                    max="20"
                  />
                </td>
                <td>
                  <input 
                    type="number" 
                    className="form-control" 
                    name="nota_2p" 
                    value={form.nota_2p} 
                    onChange={handleChange} 
                    step="0.01"
                    min="0"
                    max="20"
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="promedio" 
                    value={form.promedio} 
                    readOnly 
                  />
                </td>
                <td>
                  <button 
                    className="btn btn-success btn-sm me-1" 
                    onClick={() => actualizarEstudiante(estudiante.id)}
                  >
                    Guardar
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={cancelarEdicion}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={estudiante.id}>
                <td>{estudiante.id}</td>
                <td>{estudiante.nombre}</td>
                <td>{estudiante.apellido}</td>
                <td>{estudiante.materia}</td>
                <td>{estudiante.nota_1p}</td>
                <td>{estudiante.nota_2p}</td>
                <td>{estudiante.promedio}</td>
                <td>
                  <button 
                    className="btn btn-warning btn-sm me-1" 
                    onClick={() => iniciarEdicion(estudiante)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => eliminarEstudiante(estudiante.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionEstudiantes;