const express = require('express');
const cors = require('cors');
const { createClient } = require('@libsql/client');

const app = express();
app.use(cors());
app.use(express.json());

// Configura tu conexión a Turso
const db = createClient({
  url: 'libsql://prueba1-lupillo911.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDYwNjMwNTMsImlkIjoiMzVlNTk2YTUtZjUyYy00MmY5LTgxZGQtN2VhMTY3ZTEyOGI3IiwicmlkIjoiYjQ4NzRkNGItMzNhMS00NGJlLTg3OWUtZDQ3YzIzYWE4NDY1In0.OI1jvbWvTfcQW4D2zzPpAsQfwcIFaiSPnSrPyrgCxQZ2wGgw-nsK2XuqacHcUnHDqxx2Xftd0DmXKZATtXxADg'
});

// Ruta raíz para comprobar si el servidor funciona
// Obtener todos los productos
app.get('/productos', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar producto
app.post('/productos', async (req, res) => {
  const { Nom_prod, descripcion } = req.body;
  if (!Nom_prod || !descripcion) {
    return res.status(400).json({ error: 'El nombre y la descripción son requeridos' });
  }

  try {
    await db.execute({
      sql: 'INSERT INTO productos (Nom_prod, descripcion) VALUES (?, ?)',
      args: [Nom_prod, descripcion]
    });
    res.status(201).json({ message: 'Producto agregado' });
  } catch (err) {
    console.error('Error en POST /productos:', err); // <--- Agregado
    res.status(500).json({ error: err.message });
  }
});

// Editar producto
app.put('/productos/:Nom_prod', async (req, res) => {
    const original = req.params.Nom_prod;
    const { Nom_prod, descripcion } = req.body;  // Obtenemos ambos campos
  
    // Asegúrate de que ambos campos estén presentes en el cuerpo de la solicitud
    if (!Nom_prod || !descripcion) {
      return res.status(400).json({ error: 'El nombre y la descripción son requeridos' });
    }
  
    try {
      // Actualizamos el producto completo (nombre y descripción)
      await db.execute({
        sql: 'UPDATE productos SET Nom_prod = ?, descripcion = ? WHERE Nom_prod = ?',
        args: [Nom_prod, descripcion, original]
      });
  
      res.json({ message: 'Producto actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Eliminar producto
app.delete('/productos/:Nom_prod', async (req, res) => {
  const { Nom_prod } = req.params;
  try {
    await db.execute({
      sql: 'DELETE FROM productos WHERE Nom_prod = ?',
      args: [Nom_prod]
    });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
