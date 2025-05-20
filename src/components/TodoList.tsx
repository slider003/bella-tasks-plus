
import { useState, useEffect } from "react";
import { Check, Edit, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Todo {
  id: string;
  task: string;
  completed: boolean;
  createdAt: Date;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        return JSON.parse(saved).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
      } catch (e) {
        console.error("Failed to parse saved todos", e);
        return [];
      }
    }
    return [];
  });
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState<{ id: string; task: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTask.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        task: newTask.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([...todos, newTodo]);
      setNewTask("");
      toast({
        title: "Task added",
        description: "Your new task has been added to the list."
      });
    }
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed from your list."
    });
  };

  const startEdit = (todo: Todo) => {
    setEditTask({ id: todo.id, task: todo.task });
  };

  const updateTodo = () => {
    if (editTask && editTask.task.trim()) {
      setTodos(
        todos.map(todo => {
          if (todo.id === editTask.id) {
            return { ...todo, task: editTask.task.trim() };
          }
          return todo;
        })
      );
      setEditTask(null);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully."
      });
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, action: () => void) => {
    if (event.key === "Enter") {
      action();
    }
  };

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

        {todos.length === 0 ? (
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
                        onClick={() => toggleComplete(todo.id)}
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
