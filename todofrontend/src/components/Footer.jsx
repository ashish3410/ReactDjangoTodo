// import './App.css'
// import React, { useState, useEffect } from 'react';
// import { CheckCircle, Plus, Calendar, Clock, Edit3, Trash2, Star, AlertCircle, Circle, Check } from 'lucide-react';
// import { useAddTodoMutation } from './services/TodoApis';
// import { useListTodoQuery } from './services/TodoApis';
// import { useDeleteTodoMutation } from './services/TodoApis';
// import { useUpdateTodoMutation } from './services/TodoApis';
// import { useToggleCompleteStarredMutation } from './services/TodoApis';
// function App() {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [priority2, setPriority] = useState('')
//   const [newTask, setNewTask] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [editTask, setEditTask] = useState({
//     'id': null,
//     'title': '',
//     'priority': ''
//   })
//   const [deleteTodo] = useDeleteTodoMutation()
//   const [addTodo] = useAddTodoMutation()
//   const [updateTodo] = useUpdateTodoMutation()
//   const [toggleCompleteStarred] = useToggleCompleteStarredMutation()
//   const { data, refetch, error } = useListTodoQuery()
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const gotoTodo = (id) => {
//     const gotodo = document.getElementById(id)
//     if (gotodo) {
//       gotodo.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       })
//     }
//   }

//   const formatDate = (date) => {
//     return date.toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit'
//     });
//   };


//   const toggleComplete = async (id, completed, starred) => {
//     const res = await toggleCompleteStarred({ id, completed, starred })
//     console.log(res)
//     refetch()
//   }

//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: "smooth",
//     })
//   }

//   const updateTask = async () => {
//     const id = editTask.id
//     const title = editTask.title
//     const priority = priority2
//     const res = await updateTodo({ id, title, priority })
//     setEditTask(
//       {
//         'id': null,
//         'title': '',
//         'priority': ''
//       }

//     )
//     setPriority('')
//     refetch()
//   }

//   const deleteTask = async (id) => {
//     const res = await deleteTodo({ id })
//     console.log(res);
//     refetch()
//   };

//   const addTask = async () => {
//     const res = await addTodo({ newTask, priority2 })
//     console.log(res)
//     setNewTask('')
//     setPriority('')
//     window.scrollTo({
//       top: document.body.scrollHeight,
//       behavior: 'smooth'
//     })
//     refetch()

//   };
//   useEffect(() => {
//     if (data) {
//       setTasks(data)
//     }
//   }, [data])


//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case 'high': return 'from-red-400 to-red-600';
//       case 'medium': return 'from-yellow-400 to-yellow-600';
//       case 'low': return 'from-green-400 to-green-600';
//       default: return 'from-gray-400 to-gray-600';
//     }
//   };

//   const filteredTasks = tasks.filter(task => {
//     switch (filter) {
//       case 'today': return task.dueDate === new Date().toISOString().split('T')[0];
//       case 'week': {
//         const today = new Date();
//         const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
//         const taskDate = new Date(task.dueDate);
//         return taskDate >= today && taskDate <= weekFromNow;
//       }
//       case 'completed': return task.completed;
//       default: return true;
//     }
//   });

//   const completedCount = tasks.filter(task => task.completed).length;
//   const totalCount = tasks.length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Header */}
//       <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
//         {/* Animated background elements */}
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
//           <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-bounce"></div>
//           <div className="absolute bottom-20 left-1/3 w-12 h-12 bg-white rounded-full animate-ping"></div>
//         </div>

//         {/* Main content */}
//         <div className="relative z-10 px-8 py-12">
//           <div className="max-w-4xl mx-auto">
//             {/* Header section with stats in between */}
//             <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
//               {/* My Tasks section */}
//               <div className="flex-shrink-0">
//                 <div className="flex items-center mb-4">
//                   <div className="relative">
//                     <CheckCircle className="w-12 h-12 text-white mr-4 animate-pulse" />
//                     <div className="absolute inset-0 w-12 h-12 bg-white opacity-20 rounded-full animate-ping"></div>
//                   </div>
//                   <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
//                     My Tasks
//                   </h1>
//                 </div>
//                 <p className="text-lg text-purple-100 opacity-90">
//                   Stay organized and achieve your goals
//                 </p>
//               </div>

//               {/* Stats section in the middle - horizontal layout */}
//               <div className="flex-1 flex justify-center gap-6">
//                 <div className=" bg-opacity-10 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-400 border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
//                       <CheckCircle className="w-4 h-4 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-purple-100 text-xs font-medium">Total</p>
//                       <p className="text-xl font-bold text-white">{totalCount}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className=" bg-opacity-10 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-400 border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
//                       <CheckCircle className="w-4 h-4 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-purple-100 text-xs font-medium">Done</p>
//                       <p className="text-xl font-bold text-white">{completedCount}</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className=" bg-opacity-10 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-400 border-opacity-20 hover:bg-opacity-20 transition-all duration-300 hover:scale-105">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
//                       <Clock className="w-4 h-4 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-purple-100 text-xs font-medium">Left</p>
//                       <p className="text-xl font-bold text-white">{totalCount - completedCount}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Date and time display */}
//               <div className="flex-shrink-0 flex flex-col items-start lg:items-end space-y-2">
//                 <div className="flex items-center text-purple-100">
//                   <Calendar className="w-5 h-5 mr-2" />
//                   <span className="text-sm font-medium">{formatDate(currentTime)}</span>
//                 </div>
//                 <div className="flex items-center text-white">
//                   <Clock className="w-5 h-5 mr-2" />
//                   <span className="text-xl font-mono font-bold">{formatTime(currentTime)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Quick Task Input Bar */}
//             <div className=" bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-gray-400 border-opacity-20">
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="flex-1 relative">
//                   <input
//                     type="text"
//                     value={editTask.title ? editTask.title : newTask}
//                     onChange={(e) => editTask.title ? setEditTask({ 'id': editTask.id, 'title': (e.target.value), 'priority': priority2 }) : setNewTask(e.target.value)}
//                     // onKeyPress={(e) => e.key === 'Enter' && editTask.title?updateTask(): addTask()}
//                     placeholder="What needs to be done today?"
//                     className="w-full px-6 py-4  bg-opacity-20 backdrop-blur-sm text-white placeholder-purple-200 rounded-xl border border-gray-400 border-opacity-30 focus:border-gray-400 focus:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300 text-lg"
//                   />
//                   <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-200">
//                     <Plus className="w-5 h-5" />
//                   </div>
//                 </div>
//                 {
//                   editTask.title ?
//                     <button

//                       onClick={() => (updateTask(), gotoTodo(editTask.id))}
//                       className="px-8 py-4 bg-white  text-purple-600 font-semibold rounded-xl hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
//                     >
//                       Update Task
//                     </button>
//                     : <button
//                       onClick={() => (addTask(), gotoTodo(editTask.id))}
//                       className="px-8 py-4 bg-white  text-purple-600 font-semibold rounded-xl hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
//                     >
//                       Add Task
//                     </button>
//                 }
//               </div>

//               {/* Quick Filters */}
//               <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-400 border-opacity-20">
//                 <span className="text-purple-200 text-sm font-medium mr-2">Set Priority</span>
//                 <div className='flex gap-2'>
//                   <button
//                     onClick={() => setPriority('high' || editTask.priority)}
//                     className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${priority2 == 'high' ? 'bg-red-600' : ''}`}
//                   >
//                   </button>
//                   <span>High</span>
//                 </div>
//                 <div className='flex gap-2'>
//                   <button
//                     onClick={() => setPriority('medium' || editTask.priority)}
//                     className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${priority2 == 'medium' ? 'bg-yellow-600' : ''}`}
//                   >
//                   </button>
//                   <span>Medium</span>
//                 </div>
//                 <div className='flex gap-2'>
//                   <button
//                     onClick={() => setPriority('low' || editTask.priority)}
//                     className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${priority2 == 'low' ? 'bg-green-600' : ''}`}
//                   >
//                   </button>
//                   <span>Low</span>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Quick Filters */}
//       <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white border-opacity-20">
//         <span className="text-purple-200 text-sm font-medium mr-2">Quick filters:</span>
//         {['all', 'today', 'week', 'completed'].map((filterType) => (
//           <button
//             key={filterType}
//             onClick={() => setFilter(filterType)}
//             className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 ${filter === filterType
//                 ? 'bg-white text-purple-600'
//                 : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
//               }`}
//           >
//             {filterType === 'all' ? 'All Tasks' :
//               filterType === 'today' ? 'Today' :
//                 filterType === 'week' ? 'This Week' : 'Completed'}
//           </button>
//         ))}
//       </div>
//       {/* List Container */ }
//       <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>
//       <div className="max-w-4xl mx-auto px-8 py-8">
//         <div className="space-y-4">
//           {tasks.map((task) => (
//             <div
//               key={task.id}
//               id={task.id}
//               className={` rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-l-4 ${task.completed ? 'opacity-60' : ''
//                 } 
//                 ${task.priority === 'high' ? 'border-red-500' :
//                   task.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
//                 }
//               `}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-4 flex-1">
//                   {/* Checkbox */}
//                   <button
//                     onClick={() =>toggleComplete(task.id,!task.completed,task.starred)}
//                     className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${task.completed
//                       ? 'bg-green-500 border-green-500 text-white'
//                       : 'border-gray-300 hover:border-green-500'
//                       }`}
//                   >
//                     {task.completed && <Check className="w-4 h-4" />}
//                   </button>

//                   {/* Task Content */}
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'
//                         }`}>
//                         {task.title}
//                       </h3>

//                       {/* Star */}
//                       <button
//                         onClick={() =>toggleComplete(task.id,task.completed,!task.starred)}
//                         className={`transition-all duration-300 hover:scale-110  ${ !task.completed && (task.starred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500')}
//                           }`}
//                       >
//                         <Star className={`w-5 h-5 ${!task.completed && (task.starred ? 'fill-current' : '')}`} />
//                       </button>
//                     </div>

//                     {/* Task Meta */}
//                     <div className="flex items-center gap-4 text-sm text-gray-600">

//                       <div className="flex items-center gap-1">
//                         <Calendar className="w-4 h-4" />
//                         <span>{task.created}</span>
//                       </div>

//                       <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)} text-white text-xs font-medium`}>
//                         <AlertCircle className="w-3 h-3" />
//                         <span className="capitalize">{task.priority}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex items-center gap-2">
//                   <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
//                     onClick={() => (setEditTask({ 'id': task.id, 'title': task.title, 'priority': task.priority }),
//                       scrollToTop()
//                     )}
//                   >
//                     <Edit3 className="w-4 h-4" />
//                   </button>
//                   <button
//                     onClick={() => deleteTask(task.id)}
//                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Empty State */}
//           {filteredTasks.length === 0 && (
//             <div className="text-center py-16">
//               <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
//               <p className="text-gray-500">
//                 {filter === 'completed' ? "No completed tasks yet. Get started!" :
//                   filter === 'today' ? "No tasks due today. Enjoy your free time!" :
//                     filter === 'week' ? "No tasks due this week." :
//                       "Add your first task above to get started!"}
//               </p>
//             </div>
//           )}
//         </div>
//         {/* Progress Section */}
//         {totalCount > 0 && (
//           <div className="mt-12  rounded-2xl p-6 shadow-lg">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">Today's Progress</h3>
//               <span className="text-sm text-gray-600">
//                 {completedCount} of {totalCount} tasks completed
//               </span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-3">
//               <div
//                 className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
//                 style={{ width: `${(completedCount / totalCount) * 100}%` }}
//               ></div>
//             </div>
//             <div className="mt-2 text-right text-sm text-gray-600">
//               {Math.round((completedCount / totalCount) * 100)}% complete
//             </div>
//           </div>
//         )}
//       </div>
//     </div >
//   );
// }

// export default App