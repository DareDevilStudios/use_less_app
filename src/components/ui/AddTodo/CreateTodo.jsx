import React, { useState } from 'react';
import supabase from '@/supabase';

const TodoApp = () => {
    // State to manage tasks
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Build a todo app', time: '2024-10-20T12:00', reason: 'To learn React', completed: true },
        { id: 2, text: 'Write an article about building a todo app', time: '2024-10-21T18:00', reason: 'To share knowledge', completed: false },
        { id: 3, text: 'Publish the article', time: '2024-10-22T09:00', reason: 'To reach a wider audience', completed: false }
    ]);

    const [newTask, setNewTask] = useState({ todo: '', time: '', reason: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null); // Track if we are editing

    // Toggle task completion
    const toggleTask = (id) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    // Open the modal for editing or adding a task
    const openModal = async (task = null) => {
        const { data: { user } } = await supabase.auth.getUser(); // Get user from Supabase auth
        if (!user) {
            alert('You need to be logged in to add a task');
            return;
        }
        else {
            if (task) {
                setNewTask({ todo: task.text, time: task.time, reason: task.reason });
                setEditingTaskId(task.id);
            } else {
                setNewTask({ todo: '', time: '', reason: '' });
                setEditingTaskId(null);
            }
            setIsModalOpen(true);
        }
    };

    // Add or update a task
    const saveTask = () => {
        if (newTask.todo.trim() && newTask.time && newTask.reason.trim()) {
            if (editingTaskId) {
                // Update existing task
                setTasks(tasks.map(task =>
                    task.id === editingTaskId
                        ? { ...task, text: newTask.todo, time: newTask.time, reason: newTask.reason }
                        : task
                ));
            } else {
                // Add new task
                setTasks([...tasks, { id: tasks.length + 1, text: newTask.todo, time: newTask.time, reason: newTask.reason, completed: false }]);
            }
            setNewTask({ todo: '', time: '', reason: '' });
            setEditingTaskId(null);
            setIsModalOpen(false);
        }
    };

    // Delete a task
    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="bg-gray-900 min-h-screen flex flex-col items-center py-10">
            <div className="bg-gray-800 p-6 rounded-lg w-96">
                <h1 className="text-white text-xl mb-4">My Tasks</h1>

                {/* Task input - Modal Trigger */}
                <div className="flex items-center mb-4">

                    <button
                        onClick={() => openModal()}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-3 w-full">
                        Add new task +
                    </button>
                </div>

                {/* Task List */}
                {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between bg-gray-700 text-white p-3 rounded-lg mb-2">
                        <div className="flex items-center">
                            <span
                                onClick={() => toggleTask(task.id)}
                                className={`h-6 w-6 rounded-full mr-4 flex items-center justify-center ${task.completed ? 'bg-green-500' : 'bg-gray-500'}`}
                            >
                                {task.completed && <span className="text-white">✔</span>}
                            </span>
                            <span className={`flex-1 ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
                        </div>
                        <div className="flex">
                            {/* Edit Icon */}
                            <button
                                onClick={() => openModal(task)}
                                className="mr-2 text-yellow-500 hover:text-yellow-600">
                                ✏️
                            </button>
                            {/* Delete Icon */}
                            <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-600">
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
                        <div className="bg-gray-700 p-6 rounded-lg w-96">
                            <h2 className="text-white text-xl mb-4">{editingTaskId ? 'Edit Task' : 'Add a New Task'}</h2>

                            {/* Task Input */}
                            <div className="mb-4">
                                <label className="text-white">Todo:</label>
                                <input
                                    type="text"
                                    value={newTask.todo}
                                    onChange={(e) => setNewTask({ ...newTask, todo: e.target.value })}
                                    className="w-full bg-gray-600 text-white rounded-lg p-2 mt-1"
                                    placeholder="Enter your todo"
                                />
                            </div>

                            {/* Time to Finish Input (Date + Time) */}
                            <div className="mb-4">
                                <label className="text-white">Time to Finish:</label>
                                <input
                                    type="datetime-local"
                                    value={newTask.time}
                                    onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                                    className="w-full bg-gray-600 text-white rounded-lg p-2 mt-1"
                                />
                            </div>

                            {/* Reason Input */}
                            <div className="mb-4">
                                <label className="text-white">Reason for Doing This:</label>
                                <input
                                    type="text"
                                    value={newTask.reason}
                                    onChange={(e) => setNewTask({ ...newTask, reason: e.target.value })}
                                    className="w-full bg-gray-600 text-white rounded-lg p-2 mt-1"
                                    placeholder="Enter the reason"
                                />
                            </div>

                            {/* Modal Buttons */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 mr-2">
                                    Cancel
                                </button>
                                <button
                                    onClick={saveTask}
                                    className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-2">
                                    {editingTaskId ? 'Update Task' : 'Add Task'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodoApp;