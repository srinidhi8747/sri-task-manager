
import React from "react";
import { Task } from "@/types/task";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { useNavigate, useLocation } from "react-router-dom";

interface TaskTabsProps {
  tasks: Task[];
  currentPage: number;
  onTasksChange: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  onEdit: (id: number, newTitle: string, newDescription?: string) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number) => void;
  onAdd: (title: string, description: string, startDate: Date | null, endDate: Date | null, priority: 'low' | 'medium' | 'high') => void;
}

const TaskTabs: React.FC<TaskTabsProps> = ({
  tasks,
  currentPage,
  onTasksChange,
  onEdit,
  onDelete,
  onStatusChange,
  onAdd
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // These are used just for counting badges
  const pendingTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const historyTasksCount = tasks.filter(task => task.completedAt).length;

  // Determine the current tab based on the route
  const getCurrentTab = () => {
    switch (location.pathname) {
      case '/pending': return 'pending';
      case '/completed': return 'completed';
      case '/history': return 'history';
      default: return 'pending';
    }
  };

  // Only show the tab content corresponding to the current route
  const renderTabContent = () => {
    switch (location.pathname) {
      case '/pending':
        return (
          <>
            <TaskInput onAdd={onAdd} isCompleted={false} />
            <TaskList 
              tasks={tasks}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              isCompleted={false}
            />
          </>
        );
      case '/completed':
        return (
          <TaskList 
            tasks={tasks}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            isCompleted={true}
          />
        );
      case '/history':
        return (
          <TaskList 
            tasks={tasks}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            isCompleted={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Tabs 
      value={getCurrentTab()} 
      onValueChange={(tab) => navigate(`/${tab}`)} 
      className="w-full"
    >
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="pending" className="flex-1">
          Pending Task ({pendingTasksCount})
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex-1">
          Completed Tasks ({completedTasksCount})
        </TabsTrigger>
        <TabsTrigger value="history" className="flex-1">
          History ({historyTasksCount})
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </Tabs>
  );
};

export default TaskTabs;
