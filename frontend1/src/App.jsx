import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("https://YOUR_BACKEND_URL/tasks"); // Replace with your deployed backend URL
    setTasks(await res.json());
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await fetch("https://YOUR_BACKEND_URL/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`https://YOUR_BACKEND_URL/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    await fetch(`https://YOUR_BACKEND_URL/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        status: task.status === "completed" ? "pending" : "completed",
      }),
    });
    fetchTasks();
  };

  const saveEdit = async (id) => {
    await fetch(`https://YOUR_BACKEND_URL/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setEditId(null);
    setTitle("");
    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.status === "completed";
    if (filter === "pending") return task.status !== "completed";
    return true;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Smart Todo</h1>

        <div style={styles.inputRow}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task"
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addBtn}>
            Add
          </button>
        </div>

        <div style={styles.filters}>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
        </div>

        {filteredTasks.map((task) => (
          <div key={task.id} style={styles.task}>
            <input
              type="checkbox"
              checked={task.status === "completed"}
              onChange={() => toggleStatus(task)}
            />

            {editId === task.id ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.editInput}
              />
            ) : (
              <span
                style={{
                  ...styles.taskText,
                  textDecoration:
                    task.status === "completed" ? "line-through" : "none",
                }}
              >
                {task.title}
              </span>
            )}

            {editId === task.id ? (
              <button onClick={() => saveEdit(task.id)} style={styles.editBtn}>
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditId(task.id);
                  setTitle(task.title);
                }}
                style={styles.editBtn}
              >
                Edit
              </button>
            )}

            <button
              onClick={() => deleteTask(task.id)}
              style={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f2f2f2",
    display: "flex",
    justifyContent: "center",
    padding: "40px 10px",
  },
  container: {
    width: "95vw",
    maxWidth: "1400px",
    background: "#fff",
    padding: "30px 50px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#000",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  addBtn: {
    padding: "12px 25px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  filters: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  task: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#fafafa",
    borderRadius: "4px",
  },
  taskText: {
    flex: 1,
    color: "#000",
  },
  editInput: {
    flex: 1,
    padding: "8px",
    fontSize: "16px",
  },
  editBtn: {
    background: "#2196F3",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  deleteBtn: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default App;
