import React, { useState, useEffect } from "react";
import { Task, Priority } from "@/types/task";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

interface TaskManagerProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TaskManager = ({ tasks, onTasksChange, currentPage, onPageChange }: TaskManagerProps) => {
  const addTask = (title: string, description: string, startDate: Date | null, endDate: Date | null, priority: Priority) => {
    onTasksChange((prev: Task[]) => {
      const pendingTasks = prev.filter(t => !t.completed);
      const sequence = pendingTasks.length + 1;
      
      const newTask: Task = { 
        id: Date.now(), 
        sequence,
        title,
        description,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        completed: false,
        createdAt: new Date().toISOString(),
        createdBy: "Current User",
        priority: priority,
        completedAt: null
      };
      
      toast({ title: "Task added!", description: `"${title}" has been added.` });
      return [newTask, ...prev];
    });
  };

  const editTask = (id: number, newTitle: string, newDescription?: string) => {
    onTasksChange((prev: Task[]) =>
      prev.map(task => (task.id === id ? { 
        ...task, 
        title: newTitle,
        description: newDescription !== undefined ? newDescription : task.description 
      } : task))
    );
    toast({ title: "Task updated!", description: `Task has been updated.` });
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    
    onTasksChange((prev: Task[]) => {
      const filteredTasks = prev.filter(task => task.id !== id);
      
      const pendingTasks = filteredTasks.filter(t => !t.completed);
      pendingTasks.forEach((task, index) => {
        task.sequence = index + 1;
      });
      
      const completedTasks = filteredTasks.filter(t => t.completed);
      completedTasks.forEach((task, index) => {
        task.sequence = index + 1;
      });
      
      return filteredTasks;
    });
    
    toast({
      title: "Task deleted",
      description: `"${taskToDelete?.title ?? "Task"}" has been deleted.`,
      variant: "destructive",
    });
  };

  const toggleTaskStatus = (id: number) => {
    onTasksChange((prev: Task[]) => {
      const updatedTasks = prev.map(task => 
        task.id === id 
          ? {
              ...task, 
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null
            }
          : task
      );
      
      const pendingTasks = updatedTasks.filter(t => !t.completed);
      pendingTasks.forEach((task, index) => {
        task.sequence = index + 1;
      });
      
      const completedTasks = updatedTasks.filter(t => t.completed);
      completedTasks.forEach((task, index) => {
        task.sequence = index + 1;
      });
      
      return updatedTasks;
    });
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      if (!task.completed) {
        toast({ title: "Task completed!", description: `"${task.title}" marked as completed.` });
      } else {
        toast({ title: "Task reopened!", description: `"${task.title}" moved back to pending.` });
      }
    }
  };

  const pendingTasks = tasks
    .filter(task => !task.completed)
    .map((task, index) => ({ ...task, sequence: index + 1 }));

  const completedTasks = tasks
    .filter(task => task.completed)
    .map((task, index) => ({ ...task, sequence: index + 1 }));

  return (
    <Tabs defaultValue="pending" className="w-full">
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="pending" className="flex-1">
          Pending Tasks ({pendingTasks.length})
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex-1">
          Completed Tasks ({completedTasks.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending">
        <TaskInput onAdd={addTask} isCompleted={false} />
        <TaskList 
          tasks={pendingTasks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
          onEdit={editTask}
          onDelete={deleteTask}
          onStatusChange={toggleTaskStatus}
          isCompleted={false}
        />
      </TabsContent>
      
      <TabsContent value="completed">
        <TaskList 
          tasks={completedTasks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
          onEdit={editTask}
          onDelete={deleteTask}
          onStatusChange={toggleTaskStatus}
          isCompleted={true}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TaskManager;
