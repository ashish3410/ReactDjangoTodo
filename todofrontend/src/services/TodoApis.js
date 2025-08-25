// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
const isDevelopment = import.meta.env.MODE === 'development';
const mybaseUrl = isDevelopment ? import.meta.env.VITE_API_BASE_URL_LOCAL : import.meta.env.VITE_API_BASE_URL_DEPLOY;
const user = localStorage.getItem('username') || '';
export const TodoApis = createApi({
  reducerPath: 'TodoApis',
  baseQuery: fetchBaseQuery({ baseUrl: mybaseUrl }),
  endpoints: (builder) => ({
    userRegister: builder.mutation({
      query: ({username,email,password,confirm_Password})=>({
        url:'register/',
        method:'POST',
        body:{'username':username,'email':email,'password':password,'confirm_password':confirm_Password},
        headers:{
            'Content-Type':'application/json'
        }
      })
    }),
    userLogin: builder.mutation({
      query: ({username,password})=>({
        url:'login/',
        method:'POST',
        body:{'username':username,'password':password},
        headers:{
            'Content-Type':'application/json'
        }
      })
    }),
    userLogout: builder.mutation({
      query: ()=>({
        url:'logout/',
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
      })
    }),
    addTodo: builder.mutation({
      query: ({newTask,priority2})=>({
        url:'todo/add/',
        method:'POST',
        body:{'title':newTask,'priority':priority2,'created_by':user},
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
      })
    }),
    listTodo: builder.query({
      query: ()=>({
        url:'todo/list/',
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
      })
    }),
    deleteTodo: builder.mutation({
      query: ({id})=>({
        url:`todo/${id}/delete/`,
        method:'DELETE',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
      })
    }),
    updateTodo: builder.mutation({
      query: ({id,title, priority})=>({
        url:`todo/${id}/update/`,
        method:'PUT',
        body:({'title':title,'priority':priority}),
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
      })
    }),
    toggleCompleteStarred: builder.mutation({
      query: ({id,completed,starred})=>({
        url:`todo/${id}/completed/`,
        method:'PUT',
        body:({completed,starred}),
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
      })
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useAddTodoMutation, useListTodoQuery, useDeleteTodoMutation,
   useUpdateTodoMutation, useToggleCompleteStarredMutation, useUserLoginMutation,useUserRegisterMutation
    , useUserLogoutMutation
  } = TodoApis