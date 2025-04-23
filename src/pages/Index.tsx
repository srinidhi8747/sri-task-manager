
import { useState } from "react";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { toast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (title: string) => {
    setTasks(prev => {
      const newTask = { id: Date.now(), title };
      toast({ title: "Task added!", description: `"${title}" has been added.` });
      return [newTask, ...prev];
    });
  };

  const editTask = (id: number, newTitle: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, title: newTitle } : task))
    );
    toast({ title: "Task updated!", description: `Task changed to "${newTitle}".` });
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: `"${taskToDelete?.title ?? "Task"}" has been deleted.`,
      variant: "destructive",
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F1F0FB] px-2">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold mb-2 text-center text-[#9b87f5] tracking-tight">
          Mini Task Hub
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          A simple place to organize your tasks.
        </p>
        <TaskInput onAdd={addTask} />
        <TaskList tasks={tasks} onEdit={editTask} onDelete={deleteTask} />
      </div>
    </main>
  );
};

export default Index;
