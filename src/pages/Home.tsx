import { User } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabaseClient";

interface Todo {
  id: number;
  name: string;
  isCompleted: boolean;
  user_id: string;
}

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    // Get current user data when component mounts
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from("test").select("*");
      if (error) {
        console.log("Error fetching: ", error);
      } else {
        setTodoList(data as Todo[]);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!user) return;

    const newTodoData: Omit<Todo, 'id'> = {
      name: newTodo,
      isCompleted: false,
      user_id: user.id,
    };
    const { data, error } = await supabase
      .from("TodoList")
      .insert([newTodoData])
      .select("*")
      .single();

    if (error) {
      console.log("Error adding todo: ", error);
    } else {
      setTodoList((prev) => [...prev, data as Todo]);
      setNewTodo("");
    }
  };

  const completeTask = async (id: number, isCompleted: boolean) => {
    const { data, error } = await supabase
      .from("TodoList")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    if (error) {
      console.log("error toggling task: ", error);
    } else {
      const updatedTodoList = todoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !isCompleted } : todo
      );
      setTodoList(updatedTodoList);
    }
  };

  const deleteTask = async (id: number) => {
    const { data, error } = await supabase
      .from("TodoList")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("error deleting task: ", error);
    } else {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };

  return (
    <div>
      <h1>Hello {user?.email}</h1>
      <div>
        {" "}
        <h1>Todo List</h1>
        <div>
          <input
            type="text"
            placeholder="New Todo..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newTodo.trim()) {
                addTodo();
              }
            }}
          />
          <button onClick={addTodo}> Add Todo Item</button>
        </div>
        <ul>
          {todoList.map((todo) => (
            <li key={todo.id}>
              <p> {todo.name}</p>
              <button onClick={() => completeTask(todo.id, todo.isCompleted)}>
                {" "}
                {todo.isCompleted ? "Undo" : "Complete Task"}
              </button>
              <button onClick={() => deleteTask(todo.id)}> Delete Task</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={signOut}>Sign out</button>
      <button onClick={() => navigate("/change-username")}>Change Username</button>
    </div>
  );
}

export default Home;
