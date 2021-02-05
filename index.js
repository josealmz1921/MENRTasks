const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors')

// crear el servidor
const app = express();

// Conectar a la base de datos

conectarDB();

// Hablitar express.json
app.use(express.json({extend:true}));
 
// Habilitar cors

app.use(cors())

// puerto de la app
const PORT = process.env.PORT || 4000;

// Importar rutas

app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/proyectos',require('./routes/proyectos'));
app.use('/api/tareas',require('./routes/tareas'));

// arrancar app

app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
})

