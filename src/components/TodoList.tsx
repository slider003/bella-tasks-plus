
import { useState, useEffect } from "react";
import { Check, Edit, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Todo {
  id: string;
  task: string;
  completed: boolean;
  created_at: string;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState<{ id: string; task: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Fetch todos from Supabase
  useEffect(() => {
    const fetchTodos = async () => {
      if (!isAuthenticated || !user) {
        setTodos([]);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('todos')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          toast({
            title: "Error fetching todos",
            description: error.message,
            variant: "destructive",
          });
          console.error("Error fetching todos:", error);
          return;
        }

        setTodos(data || []);
      } catch (error) {
        console.error("Failed to fetch todos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
    
    // Set up realtime subscription
    if (isAuthenticated && user) {
      const channel = supabase
        .channel('todos-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${user.id}` },
          (payload) => {
            console.log('Realtime update received:', payload);
            
            // Handle different events
            if (payload.eventType === 'INSERT') {
              const newTodo = payload.new as Todo;
              setTodos(currentTodos => [newTodo, ...currentTodos]);
            } else if (payload.eventType === 'UPDATE') {
              const updatedTodo = payload.new as Todo;
              setTodos(currentTodos => 
                currentTodos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo)
              );
            } else if (payload.eventType === 'DELETE') {
              const deletedTodo = payload.old as Todo;
              setTodos(currentTodos => 
                currentTodos.filter(todo => todo.id !== deletedTodo.id)
              );
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime subscription status:', status);
        });

      return () => {
        console.log('Unsubscribing from realtime channel');
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated, user, toast]);

  const addTodo = async () => {
    if (!newTask.trim() || !user) return;

    try {
      const newTodo = {
        task: newTask.trim(),
        user_id: user.id,
        completed: false
      };

      // Optimistically update the UI
      const optimisticTodo = {
        ...newTodo,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString()
      } as Todo;
      
      setTodos(prevTodos => [optimisticTodo, ...prevTodos]);
      setNewTask("");

      const { error, data } = await supabase
        .from('todos')
        .insert(newTodo)
        .select()
        .single();

      if (error) {
        // Remove the optimistic todo if there's an error
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== optimisticTodo.id));
        
        toast({
          title: "Failed to add task",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      // Replace the optimistic todo with the real one from the server
      if (data) {
        setTodos(prevTodos => prevTodos.map(todo => 
          todo.id === optimisticTodo.id ? data : todo
        ));
      }

      toast({
        title: "Task added",
        description: "Your new task has been added to the list.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const toggleComplete = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistically update the UI
      setTodos(currentTodos => 
        currentTodos.map(todo => 
          todo.id === id ? { ...todo, completed: !currentStatus } : todo
        )
      );
      
      const { error } = await supabase
        .from('todos')
        .update({ completed: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        // Revert the optimistic update if there was an error
        setTodos(currentTodos => 
          currentTodos.map(todo => 
            todo.id === id ? { ...todo, completed: currentStatus } : todo
          )
        );
        
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      // Optimistically update the UI
      const todoToDelete = todos.find(todo => todo.id === id);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) {
        // Revert the optimistic update if there was an error
        if (todoToDelete) {
          setTodos(currentTodos => [...currentTodos, todoToDelete]);
        }
        
        toast({
          title: "Error deleting task",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      toast({
        title: "Task deleted",
        description: "The task has been removed from your list.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const startEdit = (todo: Todo) => {
    setEditTask({ id: todo.id, task: todo.task });
  };

  const updateTodo = async () => {
    if (!editTask || !editTask.task.trim()) return;
    
    try {
      // Optimistically update the UI
      setTodos(currentTodos => 
        currentTodos.map(todo => 
          todo.id === editTask.id ? { ...todo, task: editTask.task.trim() } : todo
        )
      );
      
      const { error } = await supabase
        .from('todos')
        .update({ task: editTask.task.trim(), updated_at: new Date().toISOString() })
        .eq('id', editTask.id);

      if (error) {
        toast({
          title: "Error updating task",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      setEditTask(null);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (event.key === "Enter") {
      action();
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="elegant-card w-full">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <p className="mb-4">Please login to manage your tasks.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="elegant-card w-full">
      <CardHeader>
        <CardTitle className="text-2xl">My Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input 
            className="elegant-input flex-1" 
            placeholder="Add a new task..." 
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => handleKeyPress(e, addTodo)}
          />
          <Button 
            className="elegant-button" 
            onClick={addTodo}
            disabled={!newTask.trim()}
          >
            <Plus size={18} className="mr-1" /> Add
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading your tasks...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You have no tasks. Add one to get started!</p>
          </div>
        ) : (
          <div className="space-y-1 mt-4">
            {todos.map(todo => (
              <div key={todo.id} className="todo-item flex items-center justify-between group">
                {editTask && editTask.id === todo.id ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <Input 
                      className="elegant-input flex-1" 
                      value={editTask.task}
                      onChange={e => setEditTask({ ...editTask, task: e.target.value })}
                      onKeyDown={e => handleKeyPress(e, updateTodo)}
                      autoFocus
                    />
                    <Button 
                      className="elegant-button" 
                      onClick={updateTodo}
                      disabled={!editTask.task.trim()}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-3 flex-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`h-6 w-6 rounded-full transition-colors ${
                          todo.completed ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary border-secondary"
                        }`}
                        onClick={() => toggleComplete(todo.id, todo.completed)}
                      >
                        {todo.completed && <Check size={14} />}
                      </Button>
                      <span 
                        className={`flex-1 ${
                          todo.completed ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {todo.task}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => startEdit(todo)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;
