const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json({ extended: true }));
app.use(cors({ credentials: true }));

app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));
app.get('*', (req, res) =>
  res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html')),
);

app.use('/api', routes);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
