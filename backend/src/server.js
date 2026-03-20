require('dotenv').config();

const express = require('express');
const cors = require('cors');
const movieRoutes = require('./routes/movieRoutes');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/movies', movieRoutes);

app.listen(PORT, () => {
    console.log(`Cinematch server is running on port ${PORT}`);
});