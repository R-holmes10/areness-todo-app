const mongoose = require('mongoose');

// Define the schema for TodoItem
const TodoItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  }
});

// Create and export the TodoItem Schema
module.exports = mongoose.model('TodoItem', TodoItemSchema);
