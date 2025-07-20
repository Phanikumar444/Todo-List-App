// src/components/TodoApp.js

import React, { useState, useEffect } from 'react';
import './TodoApp.css';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('Work');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [productivityScore, setProductivityScore] = useState(0);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const score = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setProductivityScore(score);
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleAddTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, { text: task.trim(), category, completed: false }]);
    setTask('');
  };

  const toggleComplete = index => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = index => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = event => {
      setTask(event.results[0][0].transcript);
    };
    recognition.start();
  };

  return (
    <div className={`todo-container ${darkMode ? 'dark' : 'light'}`} style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '5vw', textAlign: 'center' }}>📝 My To-Do List</h2>
        <h3 className="score" style={{ marginTop: '10px', fontSize: '4vw', textAlign: 'center' }}>🎯 Productivity Score: {productivityScore}%</h3>
      </div>

      <div className="input-section">
        <input
          type="text"
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Enter your task..."
        />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Urgent">Urgent</option>
        </select>
        <button onClick={handleAddTask}>Add</button>
        <button onClick={handleVoiceInput}>🎤 Speak</button>
      </div>

      <ul className="task-list">
        {tasks.map((t, index) => (
          <li key={index} className={t.completed ? 'completed' : ''}>
            <span>
              📌 [{t.category}] {t.text}
            </span>
            <div>
              <button onClick={() => toggleComplete(index)}>
                {t.completed ? '✅ Undo' : '✔️ Done'}
              </button>
              <button onClick={() => deleteTask(index)}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
