
import React from "react";
import { Task, Priority } from "@/types/task";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ITEMS_PER_PAGE = 10;

interface TaskManagerProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TaskManager = ({ tasks, onTasksChange, currentPage, onPageChange }: TaskManagerProps) => {
  const addTask = async (title: string, description: string, startDate: Date | null, endDate: Date | null, priority: Priority) => {
    try {
      const pendingTasks = tasks.filter(t => !t.completed);
      const sequence = pendingTasks.length + 1;
      
      const { data: newTask, error } = await supabase
        .from('tasks')
        .insert([
          {
            sequence,
            title,
            description,
            start_date: startDate?.toISOString(),
            end_date: endDate?.toISOString(),
            completed: false,
            created_by: "Current User",
            priority: priority // Ensure priority is of type Priority
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const formattedTask: Task = {
        id: newTask.id,
        sequence,
        title: newTask.title,
        description: newTask.description || '',
        startDate: newTask.start_date,
        endDate: newTask.end_date,
        completed: newTask.completed,
        createdAt: newTask.created_at,
        createdBy: newTask.created_by,
        completedAt: newTask.completed_at,
        priority: newTask.priority as Priority // Type assertion to ensure it's a Priority
      };

      onTasksChange(prev => [formattedTask, ...prev]);
      toast({ title: "Task added!", description: `"${title}" has been added.` });
    } catch (error) {
      console.error('Error adding task:', error);
      toast({ 
        title: "Error adding task", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const editTask = async (id: number, newTitle: string, newDescription?: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          title: newTitle,
          description: newDescription 
        })
        .eq('id', id);

      if (error) throw error;

      onTasksChange(prev => prev.map(task => 
        task.id === id ? { 
          ...task, 
          title: newTitle,
          description: newDescription !== undefined ? newDescription : task.description 
        } : task
      ));
      
      toast({ title: "Task updated!", description: `Task has been updated.` });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({ 
        title: "Error updating task", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const taskToDelete = tasks.find(t => t.id === id);
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      onTasksChange(prev => {
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
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({ 
        title: "Error deleting task", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleTaskStatus = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;

      const newStatus = !task.completed;
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed: newStatus,
          completed_at: newStatus ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      onTasksChange(prev => {
        const updatedTasks = prev.map(t => 
          t.id === id 
            ? {
                ...t, 
                completed: newStatus,
                completedAt: newStatus ? new Date().toISOString() : null
              }
            : t
        );
        
        const pendingTasks = updatedTasks.filter(t => !t.completed);
        pendingTasks.forEach((t, index) => {
          t.sequence = index + 1;
        });
        
        const completedTasks = updatedTasks.filter(t => t.completed);
        completedTasks.forEach((t, index) => {
          t.sequence = index + 1;
        });
        
        return updatedTasks;
      });

      if (newStatus) {
        toast({ title: "Task completed!", description: `"${task.title}" marked as completed.` });
      } else {
        toast({ title: "Task reopened!", description: `"${task.title}" moved back to pending.` });
      }
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast({ 
        title: "Error updating task", 
        description: "Please try again.",
        variant: "destructive"
      });
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
