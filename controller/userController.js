const Todo = require("../models/TodoModel")
const User = require("../models/userModel")
const mongoose = require("mongoose");

async function handelAddTodo(req, res) {
  try {
    const { title , completionTime } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const newTodo = new Todo({
      userId: req.user._id,
      title,
      isCompleted: false,
      completionTime
    });

    await newTodo.save();

    res.status(201).json({ message: 'Todo added', todo: newTodo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function handelFetchTodo(req, res) {
  try {
   
    // bhai postman use karna achhe se aur hn ye new keyboard lagana mat bhulna barna 
    // Class constructor ObjectId cannot be invoked without 'new' error ayega
    const userTodos = await Todo.find({ userId : new mongoose.Types.ObjectId(req.user._id)}); 

    if (!userTodos || userTodos.length === 0) {
      return res.status(404).json({ message: 'Todos not found' });
    }

    const currentTime = Date.now();

    if(!userTodos) return res.status(404).json({ message: 'todos not found', error: error.message });

    for (const todo of userTodos) {
      if (todo.completionTime && todo.completionTime < currentTime) {
        todo.isCompleteTime = true;
        await todo.save(); 
      }
    }
    return res.json(userTodos);

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function handelDeleteTodo(req, res) {
  try {
    const todoId = req.params.id;

    await Todo.findOneAndDelete({
      _id: todoId,
      userId: req.user._id
    });
    

    return res.json({ message: 'Todo deleted successfully' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
async function handelMarkTodo(req, res) {
  try {
    const todoId = req.params.id;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, userId: req.user._id }, 
      { $set:  { isCompleted: { $eq: [false, "$isCompleted"] } } },
      { new: true } 
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    return res.json({ message: 'Todo status updated successfully', todo: updatedTodo });
  } catch (error) {
    console.error("Error updating todo status:", error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}


async function handelUpdateTodo(req, res) {
  try {
    const todoId = req.params.id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId, userId: req.user._id }, 
      { title }, 
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }

    return res.json({ message: 'Todo updated successfully', todo: updatedTodo });
  } catch (error) {
    console.error("Error updating todo:", error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}


module.exports = { handelFetchTodo, handelAddTodo, handelDeleteTodo, handelMarkTodo, handelUpdateTodo };
