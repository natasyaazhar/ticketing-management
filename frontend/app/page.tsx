"use client";

import { useEffect, useState } from "react";

type Priority = "low" | "medium" | "high";
type Status = "todo" | "doing" | "done";

type Task = {
  id: number;
  title: string;
  status: Status;
  priority: Priority;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<Priority>("low");

  useEffect(() => {
    setTasks([
      { id: 1, title: "Setup Laravel API", status: "todo", priority: "high" },
      { id: 2, title: "Design UI", status: "doing", priority: "medium" },
      { id: 3, title: "Deploy system", status: "done", priority: "low" },
    ]);
  }, []);

  // CREATE TASK
  const handleCreate = () => {
    if (!newTask.trim()) return;

    setTasks((prev) => [
      {
        id: Date.now(),
        title: newTask,
        status: "todo",
        priority,
      },
      ...prev,
    ]);

    setNewTask("");
    setPriority("low");
    setShowModal(false);
  };

  // DELETE TASK
  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // UPDATE PRIORITY
  const updatePriority = (id: number, p: Priority) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: p } : t))
    );
  };

  // DRAG & DROP
  const onDragStart = (e: React.DragEvent, id: number) => {
    e.dataTransfer.setData("taskId", id.toString());
  };

  const onDrop = (e: React.DragEvent, status: Status) => {
    const id = Number(e.dataTransfer.getData("taskId"));

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  };

  const allowDrop = (e: React.DragEvent) => e.preventDefault();

  const getTasks = (status: Status) =>
    tasks.filter((t) => t.status === status);

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  // PRIORITY COLOR
  const priorityColor: Record<Priority, string> = {
    low: "bg-green-200",
    medium: "bg-orange-200",
    high: "bg-red-200",
  };

  // STATUS DOT (KANBAN)
  const statusDot: Record<Status, string> = {
    todo: "bg-blue-600",
    doing: "bg-yellow-500",
    done: "bg-green-700",
  };

  // STATUS TEXT COLOR (CREATED TASK SECTION FIX)
  const statusTextColor: Record<Status, string> = {
    todo: "text-blue-600",
    doing: "text-yellow-600",
    done: "text-green-800",
  };

  // COLUMN
  const Column = ({
    title,
    status,
  }: {
    title: string;
    status: Status;
  }) => (
    <div
      onDrop={(e) => onDrop(e, status)}
      onDragOver={allowDrop}
      className="bg-white p-4 rounded-xl w-1/3 min-h-[500px] shadow border"
    >
      <h2 className="text-gray-800 font-bold mb-3">{title}</h2>

      <div className="space-y-3">
        {getTasks(status).map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className={`p-3 rounded-lg flex justify-between items-center border shadow-sm ${priorityColor[task.priority]}`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${statusDot[task.status]}`} />
              <span className="text-black font-medium">{task.title}</span>
            </div>

            <div className="flex items-center gap-2 relative group">

              {/* GEAR ICON ONLY */}
              <button className="text-black text-lg">
                ⚙
              </button>

              <div className="absolute hidden group-hover:block right-0 bg-white border rounded shadow p-2 z-10">
                {(["low", "medium", "high"] as Priority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => updatePriority(task.id, p)}
                    className="block text-left text-xs w-full px-2 py-1 hover:bg-gray-100 border rounded"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-600"
              >
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">
          Ticketing Task System
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded"
        >
          + Create Task
        </button>
      </div>

      {/* CREATED TASKS */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">

        <div className="flex justify-between mb-3">
          <h2 className="font-bold text-black">Created Tasks</h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border border-gray-400 text-black px-2 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="todo">Todo</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              className={`p-3 rounded-lg flex justify-between ${priorityColor[t.priority]}`}
            >
              <span className="text-black">{t.title}</span>

              {/* STATUS COLOR FIXED */}
              <span className={`text-xs font-bold uppercase ${statusTextColor[t.status]}`}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* KANBAN */}
      <div className="flex gap-4">
        <Column title="To Do" status="todo" />
        <Column title="Doing" status="doing" />
        <Column title="Done" status="done" />
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[320px]">

            <h2 className="font-bold text-black mb-3">
              Create Task
            </h2>

            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border border-gray-400 w-full p-2 mb-3 rounded text-black"
              placeholder="Task title..."
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="border border-gray-400 w-full p-2 mb-3 rounded text-black"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setShowModal(false)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="bg-blue-900 text-white px-3 py-1 rounded"
              >
                Create
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}