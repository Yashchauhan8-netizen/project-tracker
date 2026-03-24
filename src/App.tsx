import { useState, useEffect } from "react";
import "./App.css";

type Task = {
  id: number;
  text: string;
  status: string;
};

function App() {
  // 🔥 Load from localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");

  // 🔥 Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;

    const newTask: Task = {
      id: Date.now(),
      text: input,
      status: "todo",
    };

    setTasks([...tasks, newTask]);
    setInput("");
  };

  const moveTask = (id: number, status: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const renderTasks = (status: string) => {
    return tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div key={task.id} className="task">
          <p>{task.text}</p>

          <select
            value={task.status}
            onChange={(e) => moveTask(task.id, e.target.value)}
          >
            <option value="todo">Todo</option>
            <option value="progress">Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>

          <button onClick={() => deleteTask(task.id)}>❌</button>
        </div>
      ));
  };

  return (
    <div className="container">
      <h1>Project Tracker 🚀</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="board">
        <div className="column">
          <h2>To Do</h2>
          {renderTasks("todo")}
        </div>

        <div className="column">
          <h2>In Progress</h2>
          {renderTasks("progress")}
        </div>

        <div className="column">
          <h2>In Review</h2>
          {renderTasks("review")}
        </div>

        <div className="column">
          <h2>Done</h2>
          {renderTasks("done")}
        </div>
      </div>
    </div>
  );
}

export default App;