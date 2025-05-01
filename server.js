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
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

app.get('/productos', async (req, res) => {
    try {
      console.log("Consultando productos...");
      const result = await db.execute('SELECT * FROM productos');
      console.log(result.rows);  // Asegúrate de que se reciban los datos
      res.json(result.rows);
    } catch (err) {
      console.error("Error al consultar productos:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
  

// Ejemplo de endpoint
app.get('/productos', async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
