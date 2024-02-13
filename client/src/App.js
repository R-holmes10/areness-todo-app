import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const updateInputRef = useRef(null);

  // Add new todo item to the database
  const addItem = async (e) => {
    e.preventDefault();

    // Check if itemText is not empty
    if (!itemText.trim()) {
      // Display an alert message if itemText is empty
      alert("Item cannot be empty");
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/item', { item: itemText, completed: false })
      setListItems(prev => [...prev, res.data]);
      setItemText('');
    } catch (err) {
      console.log(err);
    }
  }

  // Create function to fetch all todo items from the database
  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/items')
        setListItems(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    getItemsList();
  }, []);

  // Delete item when clicking on delete button
  const deleteItem = async (id) => {
    // Display a confirmation dialog
    const shouldDelete = window.confirm("Are you sure you want to delete this item?");

    if (!shouldDelete) {
      // If the user clicks "Cancel" in the confirmation dialog, do nothing
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/item/${id}`)
      const newListItems = listItems.filter(item => item._id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  }

  // Update item
  const updateItem = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:8080/api/item/${id}`, { completed: newStatus })
      const updatedItemIndex = listItems.findIndex(item => item._id === id);
      listItems[updatedItemIndex].completed = newStatus;
    } catch (err) {
      console.log(err);
    }
  }

  // Handle marking items as completed
  const handleComplete = (id, completed) => {
    updateItem(id, !completed);
  }

  // useEffect to focus and set cursor
  useEffect(() => {
    if (isUpdating) {
      updateInputRef.current.focus();
      updateInputRef.current.setSelectionRange(updateInputRef.current.value.length, updateInputRef.current.value.length);
    }
  }, [isUpdating]);

  const renderUpdateForm = (itemId, currentText) => (
    <form className="update-form" onSubmit={(e) => { updateItem(e, itemId) }} >
      <input
        ref={updateInputRef}
        className="update-new-input"
        type="text"
        placeholder="New Item"
        onChange={(e) => { setUpdateItemText(e.target.value) }}
        value={updateItemText || currentText} 
      />
      <button className="update-new-btn" type="submit">Update</button>
    </form>
  )
  return (
    <div className="App">
      <h1>Todo List</h1>
      <form className="form" onSubmit={e => addItem(e)}>
        <input type="text" placeholder='Add Todo Item' onChange={e => { setItemText(e.target.value) }} value={itemText} />
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
        {
          listItems.map(item => (
            <div className={`todo-item ${item.completed ? 'completed' : ''}`} key={item._id}>
              {
                isUpdating === item._id
                  ? renderUpdateForm(item._id, item.item)
                  : <>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => { handleComplete(item._id, item.completed) }}
                    />
                    <p className="item-content">{item.item}</p>
                    <button className="update-item" onClick={() => { setIsUpdating(item._id) }}>Update</button>
                    <button className="delete-item" onClick={() => { deleteItem(item._id) }}>Delete</button>
                  </>
              }
            </div>
          ))
        }
      </div>
    </div>
  );
      }

export default App;