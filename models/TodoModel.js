const mongoose = require("mongoose")

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completionTime: {
        type: Date,
        required: true
    },
    isCompleteTime: {
        type: Boolean,
        default: false
    }
})

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

module.exports = Todo