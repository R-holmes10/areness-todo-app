const router = require('express').Router();
const todoItemsModel = require('../models/itemsSchema');

// Create route to add a Todo item to the database
router.post('/api/item', async (req, res) => {
  try {
    // Create a new Todo item
    const newItem = new todoItemsModel({
      item: req.body.item
    });

    // Save this new item to the database
    const savedItem = await newItem.save();

    res.status(200).json(savedItem);
  } catch (err) {
    // To handle errors
    res.json(err);
  }
});

// Create route to get all Todo items from the database
router.get('/api/items', async (req, res) => {
  try {
    // Retrieve all Todo items from the database
    const allTodoItems = await todoItemsModel.find({});
    res.status(200).json(allTodoItems);
  } catch (err) {
    // To handle errors
    res.json(err);
  }
});

// Create route to update a Todo item
router.put('/api/item/:id', async (req, res) => {
  try {
    // Find the item by its id and update it
    const updatedItem = await todoItemsModel.findByIdAndUpdate(req.params.id, { $set: req.body });
    res.status(200).json(updatedItem);
  } catch (err) {
    // To handle errors
    res.json(err);
  }
});

// Create route to delete a Todo item from the database
router.delete('/api/item/:id', async (req, res) => {
  try {
    // Find the item by its id and delete it
    const deletedItem = await todoItemsModel.findByIdAndDelete(req.params.id);
    res.status(200).json('Item Deleted');
  } catch (err) {
    // To handle errors
    res.json(err);
  }
});

module.exports = router;
