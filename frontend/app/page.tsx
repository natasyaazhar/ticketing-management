"use client";

import { useEffect, useState } from "react";

type Priority = "low" | "medium" | "high";
type Status = "todo" | "doing" | "done";

type Task = {
  id: number;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | Status>("all");

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("low");

  useEffect(() => {
    setTasks([
      {
        id: 1,
        title: "Setup Laravel API",
        description: "Create basic CRUD endpoints",
        status: "todo",
        priority: "high",
      },
      {
        id: 2,
        title: "Design UI",
        description: "Build Kanban layout",
        status: "doing",
        priority: "medium",
      },
      {
        id: 3,
        title: "Deploy system",
        description: "Push to production",
        status: "done",
        priority: "low",
      },
    ]);
  }, []);

  // OPEN CREATE MODAL
  const openCreate = () => {
    setEditTask(null);
    setNewTask("");
    setDescription("");
    setPriority("low");
    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const openEdit = (task: Task) => {
    setEditTask(task);
    setNewTask(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setShowModal(true);
  };

  // SAVE (CREATE / UPDATE)
  const handleSave = () => {
    if (!newTask.trim()) return;

    if (editTask) {
      // UPDATE
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editTask.id
            ? { ...t, title: newTask, description, priority }
            : t
        )
      );
    } else {
      // CREATE
      setTasks((prev) => [
        {
          id: Date.now(),
          title: newTask,
          description,
          status: "todo",
          priority,
        },
        ...prev,
      ]);
    }

    setShowModal(false);
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
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

  const priorityColor: Record<Priority, string> = {
    low: "bg-green-200",
    medium: "bg-orange-200",
    high: "bg-red-200",
  };

  const statusDot: Record<Status, string> = {
    todo: "bg-blue-600",
    doing: "bg-yellow-500",
    done: "bg-green-700",
  };

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
            className={`p-3 rounded-lg border shadow-sm ${priorityColor[task.priority]}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${statusDot[task.status]}`} />
                  <span className="text-black font-medium">
                    {task.title}
                  </span>
                </div>

                <p className="text-xs text-gray-700 mt-1">
                  {task.description}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(task)}
                  className="text-black"
                >
                  ⚙
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600"
                >
                  🗑
                </button>
              </div>
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
          onClick={openCreate}
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
            className="border border-gray-300 text-gray-700 px-3 py-1 rounded"
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
              <div>
                <p className="text-black">{t.title}</p>
                <p className="text-xs text-gray-600">
                  {t.description}
                </p>
              </div>

              <span
                className={`text-xs font-bold uppercase ${statusTextColor[t.status]}`}
              >
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
              {editTask ? "Edit Task" : "Create Task"}
            </h2>

            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="border border-gray-400 w-full p-2 mb-3 rounded text-black"
              placeholder="Task title..."
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-400 w-full p-2 mb-3 rounded text-black"
              placeholder="Description..."
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
                onClick={handleSave}
                className="bg-blue-900 text-white px-3 py-1 rounded"
              >
                {editTask ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}