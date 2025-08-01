// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const TodoApis = createApi({
  reducerPath: 'TodoApis',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/todo/' }),
  endpoints: (builder) => ({
    addTodo: builder.mutation({
      query: ({newTask,priority2})=>({
        url:'add/',
        method:'POST',
        body:JSON.stringify({'title':newTask,'priority':priority2}),
        headers:{
            'Content-Type':'application/json'
        }
      })
    }),
    listTodo: builder.query({
      query: ()=>({
        url:'list/',
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
      })
    }),
    deleteTodo: builder.mutation({
      query: ({id})=>({
        url:`${id}/delete/`,
        method:'DELETE',
        headers:{
            'Content-Type':'application/json'
        }
      })
    }),
    updateTodo: builder.mutation({
      query: ({id,title,priority})=>({
        url:`${id}/update/`,
        method:'PUT',
        body:({title,priority}),
        headers:{
            'Content-Type':'application/json'
        }
      })
    }),
    toggleCompleteStarred: builder.mutation({
      query: ({id,completed,starred})=>({
        url:`${id}/completed/`,
        method:'PUT',
        body:({completed,starred}),
        headers:{
            'Content-Type':'application/json'
        }
      })
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useAddTodoMutation, useListTodoQuery, useDeleteTodoMutation, useUpdateTodoMutation, useToggleCompleteStarredMutation } = TodoApis