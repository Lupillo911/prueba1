import React, { useEffect, useState } from 'react';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [mostrarFormularioAgregar, setMostrarFormularioAgregar] = useState(false);
  const [productoNuevo, setProductoNuevo] = useState({ Nom_prod: '', descripcion: '' });
  const [productoEditar, setProductoEditar] = useState(null); // null cuando no se edita

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = () => {
    fetch('http://localhost:4000/productos')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error al obtener productos:', err));
  };

  const manejarCambioNuevo = (e) => {
    const { name, value } = e.target;
    setProductoNuevo({ ...productoNuevo, [name]: value });
  };

  const manejarCambioEditar = (e) => {
    const { name, value } = e.target;
    setProductoEditar({ ...productoEditar, [name]: value });
  };

  const manejarFormularioAgregar = (e) => {
    e.preventDefault();

    if (!productoNuevo.Nom_prod.trim() || !productoNuevo.descripcion.trim()) {
      return alert("Completa todos los campos.");
    }

    fetch('http://localhost:4000/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoNuevo),
    })
      .then((res) => {
        if (res.ok) {
          setProductoNuevo({ Nom_prod: '', descripcion: '' });
          setMostrarFormularioAgregar(false);
          obtenerProductos();
        } else {
          alert('Error al agregar producto.');
        }
      })
      .catch((err) => console.error('Error al agregar producto:', err));
  };

  const manejarFormularioEditar = (e) => {
    e.preventDefault();

    fetch(`http://localhost:4000/productos/${productoEditar.Nom_prod}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productoEditar),
    })
      .then((res) => {
        if (res.ok) {
          setProductoEditar(null);
          obtenerProductos();
        } else {
          alert('Error al editar producto.');
        }
      })
      .catch((err) => console.error('Error al editar producto:', err));
  };

  const manejarEditar = (producto) => {
    setProductoEditar({ ...producto });
  };

  const eliminarProducto = (Nom_prod) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto: ${Nom_prod}?`)) {
      fetch(`http://localhost:4000/productos/${Nom_prod}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            obtenerProductos();
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
      
      <button onClick={() => setMostrarFormularioAgregar(!mostrarFormularioAgregar)}>
        {mostrarFormularioAgregar ? 'Cancelar' : 'Agregar producto'}
      </button>

      {/* Formulario de AGREGAR */}
      {mostrarFormularioAgregar && (
        <form onSubmit={manejarFormularioAgregar} style={{ margin: '20px auto', width: '300px' }}>
          <input
            type="text"
            name="Nom_prod"
            placeholder="Nombre del producto"
            value={productoNuevo.Nom_prod}
            onChange={manejarCambioNuevo}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={productoNuevo.descripcion}
            onChange={manejarCambioNuevo}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button type="submit">Guardar</button>
        </form>
      )}

      {/* Formulario de EDITAR */}
      {productoEditar && (
        <form onSubmit={manejarFormularioEditar} style={{ margin: '20px auto', width: '300px' }}>
          <input
            type="text"
            name="Nom_prod"
            value={productoEditar.Nom_prod}
            disabled
            style={{ width: '100%', marginBottom: '10px', backgroundColor: '#eee' }}
          />
          <input
            type="text"
            name="descripcion"
            value={productoEditar.descripcion}
            onChange={manejarCambioEditar}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button type="submit">Actualizar</button>
          <button type="button" onClick={() => setProductoEditar(null)} style={{ marginLeft: '10px' }}>
            Cancelar
          </button>
        </form>
      )}

      <table border="1" cellPadding="8" cellSpacing="0" style={{ margin: '0 auto', textAlign: 'center' }}>
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
