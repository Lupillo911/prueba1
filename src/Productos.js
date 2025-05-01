import React, { useEffect, useState } from 'react';

function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error('Error al cargar productos:', err));
  }, []);

  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {productos.map((prod, index) => (
          <li key={index}>
            <strong>{prod.Nom_prod}</strong>: {prod.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Productos;
