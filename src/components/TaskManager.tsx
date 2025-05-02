
import React from "react";
import { Task } from "@/types/task";
import TaskList from "@/components/TaskList";
import { useTaskManager } from "@/hooks/use-task-manager";

interface TaskManagerProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  isCompleted?: boolean;
}

const TaskManager: React.FC<TaskManagerProps> = ({ 
  tasks, 
  onTasksChange, 
  currentPage, 
  onPageChange,
  isCompleted = false
}) => {
  const { addTask, editTask, deleteTask, toggleTaskStatus } = useTaskManager(tasks, onTasksChange);

  return (
    <TaskList
      tasks={tasks}
      onEdit={editTask}
      onDelete={deleteTask}
      onStatusChange={toggleTaskStatus}
      isCompleted={isCompleted}
    />
  );
};

export default TaskManager;
