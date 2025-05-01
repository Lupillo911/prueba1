const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@libsql/client');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Turso
const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// API
app.get('/productos', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    res.status(500).json({ error: err.message });
  }
});

app.put('/productos/:Nom_prod', async (req, res) => {
  const original = req.params.Nom_prod;
  const { Nom_prod, descripcion } = req.body;
  if (!Nom_prod || !descripcion) {
    return res.status(400).json({ error: 'El nombre y la descripción son requeridos' });
  }

  try {
    await db.execute({
      sql: 'UPDATE productos SET Nom_prod = ?, descripcion = ? WHERE Nom_prod = ?',
      args: [Nom_prod, descripcion, original]
    });
    res.json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

// ✅ Servir React desde carpeta build
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
