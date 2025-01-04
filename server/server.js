const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Other middlewares (e.g., body-parser, routes)
app.use(express.json());

// Example route
app.get('/api/test', (req, res) => {
    res.send({ message: 'Backend is working!' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
