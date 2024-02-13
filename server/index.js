const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;
// Enabling CORS
app.use(cors());
const path = require("path");

app.use(express.static(path.join(__dirname, "build"))); 

const TodoItemRoute = require('./routes/todoItems');

// Connection to MongoDB
mongoose.connect(process.env.DB, { })
  .then(() => console.log("Database connected"))
  .catch(err => console.error("Error connecting to database:", err));

// Use the TodoItemRoute for handling routes
app.use('/', TodoItemRoute);

// Start the server and listen on the defined port
app.listen(PORT, () => console.log(`Server connected and listening on port ${PORT}`));
