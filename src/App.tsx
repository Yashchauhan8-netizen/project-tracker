import { useState, useEffect } from "react";
import "./App.css";

type Task = {
  id: number;
  text: string;
  status: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;

    setTasks([
      ...tasks,
      { id: Date.now(), text: input, status: "todo" },
    ]);
    setInput("");
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // ✅ DRAG START
  const handleDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("taskId", id.toString());
  };

  // ✅ DROP
  const handleDrop = (e: React.DragEvent, status: string) => {
    const id = Number(e.dataTransfer.getData("taskId"));

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status } : t
      )
    );
  };

  const renderTasks = (status: string) => {
    return tasks
      .filter((t) => t.status === status)
      .map((t) => (
        <div
          key={t.id}
          className="task"
          draggable
          onDragStart={(e) => handleDragStart(e, t.id)}
        >
          <p>{t.text}</p>
          <button onClick={() => deleteTask(t.id)}>❌</button>
        </div>
      ));
  };

  return (
    <div className="container">
      <h1>Project Tracker 🚀</h1>

      <div className="input-section">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div className="board">
        {["todo", "progress", "review", "done"].map((status) => (
          <div
            key={status}
            className="column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, status)}
          >
            <h2>{status}</h2>
            {renderTasks(status)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;