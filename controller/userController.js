const Todo = require("../models/TodoModel")

async function handelAddTodo(req, res) {
  try {
    const { title , completionTime } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const newTodo = new Todo({
      userId: req.user._id,
      title,
      isCompleted: false,
      completionTime,
    });

    await newTodo.save();

    res.status(201).json({ message: 'Todo added', todo: newTodo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function handelFetchTodo(req, res) {
  try {
    const userTodos = await Todo.find({userId : req.user._id});
    const currentTime =  Date.now();

    userTodos.forEach(async (todo) => {
      if (todo.completionTime && todo.completionTime < currentTime) {
        todo.isCompleted = true;
        await todo.save(); 
      }
    });

    await Todo.save();

    res.json(userTodos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function handelDeleteTodo(req, res) {
  try {
    const todoId = req.params._id;
    const deletedTodo = await Todo.findOneAndDelete({
      _id: todoId,
      userId: req.user._id
    });

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found or unauthorized' });
    }
    
    await Todo.save();

    res.json({ message: 'Todo deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
async function handelMarkTodo(req, res) {
  try {
    const todoId = req.params._id;
    const todo = await Todo.findOne({
      _id: todoId,
      userId: req.user._id
    });

    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.isCompleted = !todo.isCompleted;

    await Todo.save();

    res.json({ message: 'Todo updated', todo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

async function handelUpdateTodo(req, res) {
  try {
    const todoId = req.params._id;
    const { title } = req.body;

    if (!title) return res.status(400).json({ message: 'Title is required' });

    const todo = await Todo.findOne({
      _id: todoId,
      userId: req.user._id
    });

    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.title = title;

    await Todo.save();

    res.json({ message: 'Todo updated', todo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = { handelFetchTodo, handelAddTodo, handelDeleteTodo, handelMarkTodo, handelUpdateTodo };
