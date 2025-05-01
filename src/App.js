// src/App.js
import React from 'react';
import Productos from './Productos';

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>Mi Inventario</h1>
      <Productos />
    </div>
  );
}

export default App;
