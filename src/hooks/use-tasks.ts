
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { toast } from "@/hooks/use-toast";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks = data.map((task): Task => ({
        id: task.id,
        sequence: task.sequence,
        title: task.title,
        description: task.description || '',
        startDate: task.start_date,
        endDate: task.end_date,
        completed: task.completed,
        createdAt: task.created_at,
        createdBy: task.created_by,
        completedAt: task.completed_at,
        priority: task.priority as 'low' | 'medium' | 'high'
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({ 
        title: "Error fetching tasks", 
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTasksState = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  return {
    tasks,
    setTasks: updateTasksState,
    isLoading,
    refetch: fetchTasks
  };
};
