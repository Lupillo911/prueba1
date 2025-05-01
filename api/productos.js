import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://prueba1-lupillo911.aws-us-east-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDYwNjMwNTMsImlkIjoiMzVlNTk2YTUtZjUyYy00MmY5LTgxZGQtN2VhMTY3ZTEyOGI3IiwicmlkIjoiYjQ4NzRkNGItMzNhMS00NGJlLTg3OWUtZDQ3YzIzYWE4NDY1In0.OI1jvbWvTfcQW4D2zzPpAsQfwcIFaiSPnSrPyrgCxQZ2wGgw-nsK2XuqacHcUnHDqxx2Xftd0DmXKZATtXxADg'
});

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getProductos(req, res);
    case 'POST':
      return agregarProducto(req, res);
    case 'PUT':
      return editarProducto(req, res);
    case 'DELETE':
      return eliminarProducto(req, res);
    default:
      return res.status(405).json({ error: 'Método no permitido' });
  }
}

async function getProductos(req, res) {
  try {
    const result = await db.execute('SELECT * FROM productos');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function agregarProducto(req, res) {
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
}

async function editarProducto(req, res) {
  const original = req.query.Nom_prod;
  const { Nom_prod, descripcion } = req.body;

  if (!Nom_prod || !descripcion) {
    return res.status(400).json({ error: 'El nombre y la descripción son requeridos' });
  }

  try {
    await db.execute({
      sql: 'UPDATE productos SET Nom_prod = ?, descripcion = ? WHERE Nom_prod = ?',
      args: [Nom_prod, descripcion, original]
    });
    res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function eliminarProducto(req, res) {
  const { Nom_prod } = req.query;
  try {
    await db.execute({
      sql: 'DELETE FROM productos WHERE Nom_prod = ?',
      args: [Nom_prod]
    });
    res.status(200).json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
