import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [itemText, setItemText] = useState('');
  const [listItems, setListItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState('');
  const [updateItemText, setUpdateItemText] = useState('');
  const updateInputRef = useRef(null);

  const addItem = async (e) => {
    e.preventDefault();

    if (!itemText.trim()) {
      alert("Item cannot be empty");
      return;
    }

    try {
      const res = await axios.post('https://areness-todo-app-backend.onrender.com/api/item', {
        item: itemText,
        completed: false
      });
      setListItems((prev) => [...prev, res.data]);
      setItemText('');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getItemsList = async () => {
      try {
        const res = await axios.get('https://areness-todo-app-backend.onrender.com/api/items');
        setListItems(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getItemsList();
  }, []);

  const deleteItem = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this item?");

    if (!shouldDelete) {
      return;
    }

    try {
      await axios.delete(`https://areness-todo-app-backend.onrender.com/api/item/${id}`);
      const newListItems = listItems.filter((item) => item._id !== id);
      setListItems(newListItems);
    } catch (err) {
      console.log(err);
    }
  };

  const updateItem = async (id, newText) => {
    try {
      const res = await axios.put(`https://areness-todo-app-backend.onrender.com/api/item/${id}`, { item: newText });
      const updatedListItems = listItems.map((item) => (item._id === id ? { ...item, item: newText } : item));
      setListItems(updatedListItems);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplete = (id, completed) => {
    updateItem(id, !completed);
  };

  useEffect(() => {
    if (isUpdating) {
      updateInputRef.current.focus();
      updateInputRef.current.setSelectionRange(
        updateInputRef.current.value.length,
        updateInputRef.current.value.length
      );
    }
  }, [isUpdating]);

  const renderUpdateForm = (itemId, currentText) => (
    <form
      className="update-form"
      onSubmit={(e) => {
        e.preventDefault();
        updateItem(itemId, updateItemText);
        setIsUpdating('');
      }}
    >
      <input
        ref={updateInputRef}
        className="update-new-input"
        type="text"
        placeholder="New Item"
        onChange={(e) => {
          setUpdateItemText(e.target.value);
        }}
        value={updateItemText}
      />
      <button className="update-new-btn" type="submit">
        Update
      </button>
    </form>
  );

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form className="form" onSubmit={(e) => addItem(e)}>
        <input type="text" placeholder="Add Todo Item" onChange={(e) => setItemText(e.target.value)} value={itemText} />
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
        {listItems.map((item) => (
          <div className={`todo-item ${item.completed ? 'completed' : ''}`} key={item._id}>
            {isUpdating === item._id ? (
              renderUpdateForm(item._id, item.item)
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {
                    handleComplete(item._id, item.completed);
                  }}
                />
                <p className="item-content">{item.item}</p>
                <button
                  className="update-item"
                  onClick={() => {
                    setIsUpdating(item._id);
                    setUpdateItemText(item.item); // Set initial value for the update text
                  }}
                >
                  Update
                </button>
                <button className="delete-item" onClick={() => deleteItem(item._id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
