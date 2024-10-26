import React, { useEffect, useState } from 'react';
import supabase from '@/supabase';
import Toast from '@/components/common/Toast';
import toast from 'react-hot-toast';

const TodoApp = ({ startCriticise, todoFetcher }) => {
    const [toastVisible, setToastVisible] = useState(false);
    const criticisms = [
        "എടാ നിനക്ക് പറഞ്ഞ പണി ഒന്നും അല്ല ഇത്",
        "നിനക്ക് പറ്റില്ലെങ്കിൽ പറ ഞാൻ ചെയ്യാം ",
        "നിന്നെ കൊണ്ട് ഈ വീടിനും നാടിനും എന്തെങ്കിലും ഗുണമുണ്ടോ ",
        "ഒരു പണിയും എടുക്കാതെ വെറുതെ കുത്തി ഇരിക്ക്"
    ];

    const showToast = () => {
        setToastVisible(true);
    };

    const hideToast = () => {
        setToastVisible(false);
    };

    // fetching loader
    const [Loader, setLoader] = useState(true);
    // State to manage tasks
    const [tasks, setTasks] = useState([]);
    const [User, setUser] = useState({});
    const [newTask, setNewTask] = useState({ todo: '', date: '', time: '', reason: '', status: false });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState(null); // Track if we are editing

    const fetchTasks = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        console.log("user", user);
        setUser(user);

        const { data, error } = await supabase
            .from('user_data')
            .select('*')
            .eq('user_id', user.id)

        if (error) {
            console.error('Error fetching tasks:', error);
        } else {
            console.log("data", data);

            const sortedData = data.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA - dateB;
            });

            console.log("sorted data", sortedData);

            setTasks(data);
            setLoader(false);
        }

    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        todoFetcher(tasks)
    }, [tasks]);

    useEffect(() => {
        const checkTaskTimes = () => {
            const currentTime = new Date();

            tasks.forEach(task => {
                const taskTime = new Date(`${task.date} ${task.time}`); // Add space between date and time
                if (task.status === false && currentTime >= taskTime) {
                    console.log(`Task "${task.todo}": Have you not finished yet?`);
                    const randomCritic = criticisms[Math.floor(Math.random() * criticisms.length)];
                    toast(randomCritic, { icon: '😤' });
                }
                else {
                    startCriticise()
                }
            });
        };

        const intervalId = setInterval(checkTaskTimes, 10000); // Check every minute

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, [tasks]);


    // Toggle task completion
    const toggleTask = async (id) => {
        const { data, error } = await supabase
            .from('user_data')
            .update({ status: !tasks.find(task => task.id === id).status })
            .eq('id', id)

        if (error) {
            console.error('Error updating task:', error);
            return;
        }

        console.log("updated todo : ", data);
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, status: !task.status } : task
        );
        setTasks(updatedTasks);

        console.log("updatedTasks", updatedTasks);
    };


    // Open the modal for editing or adding a task
    const openModal = async (task) => {
        if (task) {
            setNewTask({ todo: task.todo, date: task.date, time: task.time, reason: task.reason, status: task.status });
            setEditingTaskId(task.id);
        } else {
            setNewTask({ todo: '', date: '', time: '', reason: '' });
            setEditingTaskId(null);
        }
        setIsModalOpen(true);
    };

    // Add or update a task
    const saveTask = async () => {
        if (newTask.todo.trim() && newTask.date && newTask.time && newTask.reason.trim()) {
            let taskData = {
                todo: newTask.todo,
                date: newTask.date,
                time: newTask.time,
                reason: newTask.reason,
                status: false,
                user_id: User.id
            };

            if (editingTaskId) {
                taskData = { ...taskData, id: editingTaskId }; // Include id for updating
            }

            const { data, error } = await supabase
                .from('user_data')
                .upsert(taskData)
                .select();

            if (error) {
                console.error('Error saving task:', error);
            } else {
                console.log("Data saved/updated", data);
                await fetchTasks(); // Re-fetch tasks to update UI
            }

            setNewTask({ todo: '', date: '', time: '', reason: '' });
            setEditingTaskId(null);
            setIsModalOpen(false);
        }
    };


    // Delete a task
    const deleteTask = async (id) => {
        const response = await supabase
            .from('user_data')
            .delete()
            .eq('id', id)

        console.log("response", response);

        if (response.error) return

        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div className="bg-gray-900 h-full flex flex-col items-center py-10">
            {/* <button onClick={() => {
                fetch("/api/vibe_talk", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        prompt: `I am ${User.user_metadata.full_name} and tasks information are ${JSON.stringify(tasks)}. Please provide constructive feedback on these tasks in a roasting manner. in a json format`,
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Response:", data);

                        if (data.error) return;

                        const stripMarkdown = (str) => {
                            // Check if the string contains the markers
                            if (str.includes("```json") && str.includes("```")) {
                                return str.replace(/```json\s*|\s*```/g, '').trim();
                            }
                            // If markers are not present, return the original string
                            return str;
                        };

                        // Use the function to clean the input string
                        const cleanedString = stripMarkdown(data); // Ensure it's a string

                        // Log the cleaned string
                        console.log("Cleaned String:", JSON.stringify(cleanedString));

                    })
                    .catch(error => {
                        console.error("Error:", error);
                    });

            }}>
                Click
            </button> */}
            {/* {toastVisible && <Toast message="Sign in to add tasks!" onClose={hideToast} bgcolor="bg-red-500" />} */}
            {
                Loader ? (
                    <div className='h-full flex items-center'>
                        <svg className="animate-spin h-12 w-12 mr-3 text-white bg-white" viewBox="0 0 24 24"></svg>
                    </div>
                ) : (
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
                                        className={`h-6 w-6 rounded-full mr-4 flex items-center justify-center ${task.status ? 'bg-green-500' : 'bg-gray-500'}`}
                                    >
                                        {task.status && <span className="text-white">✔</span>}
                                    </span>
                                    <span className={`flex-1 ${task.status ? 'line-through' : ''}`}>{task.todo}</span>
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

                                    {/* Date Input */}
                                    <div className="mb-4">
                                        <label className="text-white">Date:</label>
                                        <input
                                            type="date"
                                            value={newTask.date}
                                            onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                                            className="w-full bg-gray-600 text-white rounded-lg p-2 mt-1"
                                        />
                                    </div>

                                    {/* Time Input */}
                                    <div className="mb-4">
                                        <label className="text-white">Time:</label>
                                        <input
                                            type="time"
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
                                            placeholder="Why are you doing this?"
                                        />
                                    </div>

                                    <button
                                        onClick={saveTask}
                                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-3 w-full">
                                        Save Task
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white rounded-lg p-3 w-full mt-2">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
        </div>
    );
};

export default TodoApp;
