
import React, { useState, useEffect } from "react";
import { Task, Priority } from "@/types/task";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 10;

interface TaskManagerProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TaskManager = ({ tasks, onTasksChange, currentPage, onPageChange }: TaskManagerProps) => {
  const addTask = (title: string, startDate: Date | null, endDate: Date | null, priority: Priority) => {
    onTasksChange(prev => {
      const sequence = prev.length + 1;
      const newTask: Task = { 
        id: Date.now(), 
        sequence,
        title, 
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

  const editTask = (id: number, newTitle: string) => {
    onTasksChange(prev =>
      prev.map(task => (task.id === id ? { ...task, title: newTitle } : task))
    );
    toast({ title: "Task updated!", description: `Task changed to "${newTitle}".` });
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    onTasksChange(prev => prev.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: `"${taskToDelete?.title ?? "Task"}" has been deleted.`,
      variant: "destructive",
    });
  };

  const toggleTaskStatus = (id: number) => {
    onTasksChange(prev => 
      prev.map(task => 
        task.id === id 
          ? {
              ...task, 
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null
            }
          : task
      )
    );
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      if (!task.completed) {
        toast({ title: "Task completed!", description: `"${task.title}" marked as completed.` });
      } else {
        toast({ title: "Task reopened!", description: `"${task.title}" moved back to pending.` });
      }
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

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
