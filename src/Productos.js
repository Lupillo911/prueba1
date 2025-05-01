import React, { useEffect, useState } from 'react';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditar, setProductoEditar] = useState({ Nom_prod: '', descripcion: '' });

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = () => {
    fetch('http://localhost:4000/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error al obtener productos:', err));
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setProductoEditar({ ...productoEditar, [name]: value });
  };

  const manejarFormulario = (e) => {
    e.preventDefault();
    
    if (!productoEditar.Nom_prod.trim() || !productoEditar.descripcion.trim()) {
      return alert("Completa todos los campos.");
    }

    if (productoEditar.Nom_prod) {
      editarProducto();
    } else {
      agregarProducto();
    }
  };

  const agregarProducto = () => {
    fetch('http://localhost:4000/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoEditar),
    })
      .then((res) => {
        if (res.ok) {
          setProductoEditar({ Nom_prod: '', descripcion: '' });
          setMostrarFormulario(false);
          obtenerProductos();
        } else {
          alert('Error al agregar producto.');
        }
      })
      .catch((err) => console.error('Error al agregar producto:', err));
  };

  const editarProducto = () => {
    fetch(`http://localhost:4000/productos/${productoEditar.Nom_prod}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoEditar),
    })
      .then((res) => {
        if (res.ok) {
          setProductoEditar({ Nom_prod: '', descripcion: '' });
          setMostrarFormulario(false);
          obtenerProductos();
        } else {
          alert('Error al editar producto.');
        }
      })
      .catch((err) => console.error('Error al editar producto:', err));
  };

  const manejarEditar = (producto) => {
    setProductoEditar({ ...producto });
    setMostrarFormulario(true);
  };

  // Función para eliminar un producto
  const eliminarProducto = (Nom_prod) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto: ${Nom_prod}?`)) {
      fetch(`http://localhost:4000/productos/${Nom_prod}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            obtenerProductos(); // Actualizar la lista de productos después de eliminar
          } else {
            alert('Error al eliminar producto.');
          }
        })
        .catch((err) => console.error('Error al eliminar producto:', err));
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Lista de Productos</h2>
      <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        {mostrarFormulario ? 'Cancelar' : 'Agregar producto'}
      </button>

      {mostrarFormulario && (
        <form onSubmit={manejarFormulario} style={{ margin: '20px auto', width: '300px' }}>
          <input
            type="text"
            name="Nom_prod"
            placeholder="Nombre del producto"
            value={productoEditar.Nom_prod}
            onChange={manejarCambio}
            style={{ width: '100%', marginBottom: '10px' }}
            disabled // Deshabilitado para no permitir editar el nombre
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={productoEditar.descripcion}
            onChange={manejarCambio}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button type="submit">{productoEditar.Nom_prod ? 'Actualizar' : 'Guardar'}</button>
        </form>
      )}

      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ margin: '0 auto', textAlign: 'center' }}
      >
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod, index) => (
            <tr key={index}>
              <td>{prod.Nom_prod}</td>
              <td>{prod.descripcion}</td>
              <td>
                <button onClick={() => manejarEditar(prod)}>Editar</button>{' '}
                <button onClick={() => eliminarProducto(prod.Nom_prod)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Productos;
