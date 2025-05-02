
import React from "react";
import { Task } from "@/types/task";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

const ITEMS_PER_PAGE = 5;

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

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const historyTasks = tasks.filter(task => task.completedAt); // Assuming you want to track completed task history

  // Determine the current tab based on the route
  const getCurrentTab = () => {
    switch (location.pathname) {
      case '/pending': return 'pending';
      case '/completed': return 'completed';
      case '/history': return 'history';
      default: return 'pending';
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
          Pending Task ({pendingTasks.length})
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex-1">
          Completed Tasks ({completedTasks.length})
        </TabsTrigger>
        <TabsTrigger value="history" className="flex-1">
          History ({historyTasks.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending">
        <TaskInput onAdd={onAdd} isCompleted={false} />
        <TaskList 
          tasks={pendingTasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          isCompleted={false}
        />
      </TabsContent>
      
      <TabsContent value="completed">
        <TaskList 
          tasks={completedTasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          isCompleted={true}
        />
      </TabsContent>

      <TabsContent value="history">
        <TaskList 
          tasks={historyTasks}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          isCompleted={true}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TaskTabs;
