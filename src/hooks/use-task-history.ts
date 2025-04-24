
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/types/task";
import { toast } from "@/hooks/use-toast";

interface DeletedTask extends Task {
  deletedAt: string;
  deletedBy: string;
}

export const useTaskHistory = () => {
  const [deletedTasks, setDeletedTasks] = useState<DeletedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeletedTasks();
  }, []);

  const fetchDeletedTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks_history')
        .select('*')
        .order('deleted_at', { ascending: false });

      if (error) throw error;

      const formattedTasks = data.map((task): DeletedTask => ({
        id: task.task_id,
        sequence: task.sequence,
        title: task.title,
        description: task.description || '',
        startDate: task.start_date,
        endDate: task.end_date,
        completed: task.completed,
        createdAt: task.created_at,
        createdBy: task.created_by,
        completedAt: task.completed_at,
        priority: task.priority as 'low' | 'medium' | 'high',
        deletedAt: task.deleted_at,
        deletedBy: task.deleted_by
      }));

      setDeletedTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching deleted tasks:', error);
      toast({ 
        title: "Error fetching task history", 
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deletedTasks,
    isLoading,
    refetch: fetchDeletedTasks
  };
};
