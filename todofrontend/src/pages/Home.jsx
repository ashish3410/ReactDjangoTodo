"use client"
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo } from "react"
import {
  CheckCircle,
  Plus,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Star,
  AlertCircle,
  Circle,
  Check,
  Filter,
  Search,
  X,
} from "lucide-react"

// Mock API hooks - replace with your actual implementations
import { useAddTodoMutation } from '../services/TodoApis'
import { useUpdateTodoMutation } from "../services/TodoApis"
import { useListTodoQuery } from "../services/TodoApis"
import { useDeleteTodoMutation } from "../services/TodoApis"
import { useToggleCompleteStarredMutation } from "../services/TodoApis"
import { useUserLogoutMutation } from "../services/TodoApis"

const PRIORITY_COLORS = {
  high: "from-red-400 to-red-600",
  medium: "from-yellow-400 to-yellow-600",
  low: "from-green-400 to-green-600",
}

const FILTER_OPTIONS = [
  { key: "all", label: "All Tasks" },
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "completed", label: "Completed" },
  { key: "starred", label: "Starred" },
]

function TodoApp() {
  // State management
  const [currentTime, setCurrentTime] = useState(new Date())
  const [priority, setPriority] = useState("")
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editTask, setEditTask] = useState({
    id: null,
    title: "",
    priority: "",
  })

  // API hooks
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation()
  const [addTodo, { isLoading: isAdding }] = useAddTodoMutation()
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation()
  const [toggleCompleteStarred] = useToggleCompleteStarredMutation()
  const { data, refetch, error, isLoading } = useListTodoQuery()
  const [userLogout] = useUserLogoutMutation();
  // Clock effect with cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Memoized calculations
  const taskStats = useMemo(() => {
    const tasks = data || []
    const total = tasks.length
    const completed = tasks.filter((task) => task.completed).length
    const remaining = total - completed
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, remaining, completionPercentage }
  }, [data])

  // Filtered and searched tasks
  const filteredTasks = useMemo(() => {
    const tasks = data || []
    const filtered = tasks.filter((task) => {
      // Apply search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Apply category filter
      switch (filter) {
        case "today":
          return task.dueDate === new Date().toISOString().split("T")[0]
        case "week": {
          const today = new Date()
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          const taskDate = new Date(task.dueDate || "")
          return taskDate >= today && taskDate <= weekFromNow
        }
        case "completed":
          return task.completed
        case "starred":
          return task.starred && !task.completed
        default:
          return true
      }
    })

    // Sort tasks: starred first, then by priority, then by completion status
    return filtered.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (a.starred !== b.starred) return b.starred ? 1 : -1

      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }, [data, filter, searchQuery])

  // Utility functions
  const formatDate = useCallback((date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }, [])

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }, [])

  const scrollToElement = useCallback((id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    })
  }, [])

  // Task operations
  const handleToggleComplete = useCallback(
    async (id, completed, starred) => {
      try {
        await toggleCompleteStarred({ id, completed, starred })
        refetch()
      } catch (error) {
        console.error("Failed to toggle task:", error)
      }
    },
    [toggleCompleteStarred, refetch],
  )

  const handleUpdateTask = useCallback(async () => {
    if (!editTask.id || !editTask.title.trim()) return

    try {
      await updateTodo({
        id: editTask.id,
        title: editTask.title.trim(),
        priority: priority || "medium",
      })

      setEditTask({ id: null, title: "", priority: "" })
      setPriority("")
      refetch()
      scrollToElement(editTask.id)
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }, [editTask, priority, updateTodo, refetch, scrollToElement])

  const handleDeleteTask = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this task?")) return

      try {
        await deleteTodo({ id })
        refetch()
      } catch (error) {
        console.error("Failed to delete task:", error)
      }
    },
    [deleteTodo, refetch],
  )

  const handleAddTask = useCallback(async () => {
    if (!newTask.trim()) return

    try {
      const res = await addTodo({
        newTask: newTask.trim(),
        priority: priority || "medium",
      })
      // console.log(res)

      setNewTask("")
      setPriority("")
      refetch()

      // Scroll to bottom after a short delay to allow for DOM update
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        })
      }, 100)
    } catch (error) {
      console.error("Failed to add task:", error)
    }
  }, [newTask, priority, addTodo, refetch])

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (editTask.title) {
          handleUpdateTask()
        } else {
          handleAddTask()
        }
      }
      if (e.key === "Escape") {
        setEditTask({ id: null, title: "", priority: "" })
        setPriority("")
      }
    },
    [editTask.title, handleUpdateTask, handleAddTask],
  )

  const handleEditTask = useCallback(
    (task) => {
      setEditTask({
        id: task.id,
        title: task.title,
        priority: task.priority,
      })
      setPriority(task.priority)
      scrollToTop()
    },
    [scrollToTop],
  )

  const clearSearch = useCallback(() => {
    setSearchQuery("")
  }, [])
  const navigate = useNavigate();
  const handleLogout = useCallback(() => {  
    userLogout()
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/registerorlogin');
  }, [navigate]);
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-red-600">Failed to load tasks. Please try again later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div>
        <button onClick={handleLogout} className="z-50 absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-white rounded-full animate-ping"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 px-4 sm:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header section with stats */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
              {/* My Tasks section */}
              <div className="flex-shrink-0">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <CheckCircle className="w-12 h-12 text-white mr-4 animate-pulse" />
                    <div className="absolute inset-0 w-12 h-12 bg-white opacity-20 rounded-full animate-ping"></div>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    My Tasks
                  </h1>
                </div>
                <p className="text-lg text-purple-100 opacity-90">Stay organized and achieve your goals</p>
              </div>

              {/* Stats section */}
              <div className="flex-1 flex justify-center gap-4 sm:gap-6">
                <div className=" bg-opacity-10 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 border border-gray-400 border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-purple-100 text-xs font-medium">Total</p>
                      <p className="text-xl font-bold text-white">{taskStats.total}</p>
                    </div>
                  </div>
                </div>

                <div className=" bg-opacity-10 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 border border-gray-400 border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-purple-100 text-xs font-medium">Done</p>
                      <p className="text-xl font-bold text-white">{taskStats.completed}</p>
                    </div>
                  </div>
                </div>

                <div className=" bg-opacity-10 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 border border-gray-400 border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-purple-100 text-xs font-medium">Left</p>
                      <p className="text-xl font-bold text-white">{taskStats.remaining}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date and time display */}
              <div className="flex-shrink-0 flex flex-col items-start lg:items-end space-y-2">
                <div className="flex items-center text-purple-100">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">{formatDate(currentTime)}</span>
                </div>
                <div className="flex items-center text-white">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="text-xl font-mono font-bold">{formatTime(currentTime)}</span>
                </div>
              </div>
            </div>

            {/* Task Input Section */}
            <div className=" bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-gray-400 border-opacity-20">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={editTask.title || newTask}
                    onChange={(e) => {
                      if (editTask.title) {
                        setEditTask((prev) => ({ ...prev, title: e.target.value }))
                      } else {
                        setNewTask(e.target.value)
                      }
                    }}
                    onKeyDown={handleKeyPress}
                    placeholder="What needs to be done today?"
                    className="w-full px-6 py-4  bg-opacity-20 backdrop-blur-sm text-white placeholder-purple-200 rounded-xl border border-gray-400 border-opacity-30 focus:border-gray-400 focus:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300 text-lg"
                    disabled={isAdding || isUpdating}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-200">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>

                <button
                  onClick={editTask.title ? handleUpdateTask : handleAddTask}
                  disabled={isAdding || isUpdating || (!editTask.title && !newTask.trim())}
                  className="px-8 py-4  text-white font-semibold rounded-xl hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isAdding || isUpdating ? "Processing..." : editTask.title ? "Update Task" : "Add Task"}
                </button>

                {editTask.title && (
                  <button
                    onClick={() => {
                      setEditTask({ id: null, title: "", priority: "" })
                      setPriority("")
                    }}
                    className="px-4 py-4 bg-red-500 bg-opacity-20 text-white font-semibold rounded-xl hover:bg-opacity-30 transition-all duration-300 hover:scale-105"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Priority Selection */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-400 border-opacity-20">
                <span className="text-purple-200 text-sm font-medium mr-2">Priority:</span>
                {["high", "medium", "low"].map((level) => (
                  <div key={level} className="flex items-center gap-2">
                    <button
                      onClick={() => setPriority(level)}
                      className={`w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer ${priority === level
                          ? `bg-${level === "high" ? "red" : level === "medium" ? "yellow" : "green"}-600`
                          : ""
                        }`}
                    >
                      {priority === level && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className="text-purple-200 capitalize text-sm">{level}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Search and Filters */}
            <div className="mt-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-200 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-12 pr-12 py-3  bg-opacity-10 backdrop-blur-sm text-white placeholder-purple-200 rounded-xl border border-gray-400 border-opacity-30 focus:border-gray-400 focus:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-200 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-purple-200 text-sm font-medium">
                  <Filter className="w-4 h-4" />
                  <span>Filters:</span>
                </div>
                {FILTER_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 hover:cursor-pointer ${filter === key
                        ? " text-purple-600"
                        : " bg-opacity-20 text-white hover:bg-opacity-30"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                id={task.id}
                className={` rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-l-4 ${task.completed ? "opacity-60" : ""
                  } ${task.priority === "high"
                    ? "border-red-500"
                    : task.priority === "medium"
                      ? "border-yellow-500"
                      : "border-green-500"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleComplete(task.id, !task.completed, task.starred)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${task.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-500"
                        }`}
                    >
                      {task.completed && <Check className="w-4 h-4" />}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className={`text-lg font-semibold ${task.completed ? "line-through text-gray-500" : "text-gray-800"
                            }`}
                        >
                          {task.title}
                        </h3>

                        {/* Star */}
                        <button
                          onClick={() => handleToggleComplete(task.id, task.completed, !task.starred)}
                          className={`transition-all duration-300 hover:scale-110 ${!task.completed &&
                            (task.starred ? "text-yellow-500" : "text-gray-300 hover:text-yellow-500")
                            }`}
                          disabled={task.completed}
                        >
                          <Star className={`w-5 h-5 ${!task.completed && task.starred ? "fill-current" : ""}`} />
                        </button>
                      </div>

                      {/* Task Meta */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{task.created}</span>
                        </div>
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${PRIORITY_COLORS[task.priority]} text-white text-xs font-medium`}
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                      disabled={task.completed}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredTasks.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchQuery ? "No matching tasks found" : "No tasks found"}
                </h3>
                <p className="text-gray-500">
                  {searchQuery ? (
                    <>
                      Try adjusting your search or{" "}
                      <button onClick={clearSearch} className="text-purple-600 hover:underline">
                        clear the search
                      </button>
                    </>
                  ) : filter === "completed" ? (
                    "No completed tasks yet. Get started!"
                  ) : filter === "today" ? (
                    "No tasks due today. Enjoy your free time!"
                  ) : filter === "week" ? (
                    "No tasks due this week."
                  ) : filter === "starred" ? (
                    "No starred tasks. Star important tasks to see them here!"
                  ) : (
                    "Add your first task above to get started!"
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Section */}
        {taskStats.total > 0 && (
          <div className="mt-12  rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Today's Progress</h3>
              <span className="text-sm text-gray-600">
                {taskStats.completed} of {taskStats.total} tasks completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${taskStats.completionPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-right text-sm text-gray-600">{taskStats.completionPercentage}% complete</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TodoApp
