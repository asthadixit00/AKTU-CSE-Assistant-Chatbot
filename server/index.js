require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = express.Router();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  res.json({
    answer: `Echo: "${message}". Backend ready!`,
    sourceType: 'test'
  });
});

app.listen(5000, () => console.log('Server: http://localhost:5000'));
