
import React from "react";
import { Task } from "@/types/task";
import TaskTabs from "@/components/TaskTabs";
import { useTaskManager } from "@/hooks/use-task-manager";

interface TaskManagerProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ 
  tasks, 
  onTasksChange, 
  currentPage, 
  onPageChange 
}) => {
  const { addTask, editTask, deleteTask, toggleTaskStatus } = useTaskManager(tasks, onTasksChange);

  return (
    <TaskTabs
      tasks={tasks}
      currentPage={currentPage}
      onTasksChange={onTasksChange}
      onEdit={editTask}
      onDelete={deleteTask}
      onStatusChange={toggleTaskStatus}
      onAdd={addTask}
    />
  );
};

export default TaskManager;
