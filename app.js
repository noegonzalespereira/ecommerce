const express = require('express');
const app = express();
const userRoutes = require('./routes/user');  // Ruta al archivo donde tienes tus rutas

app.use(express.json());  // Middleware para parsear JSON
app.use('/users', userRoutes);  // Usar las rutas bajo "/users"
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
