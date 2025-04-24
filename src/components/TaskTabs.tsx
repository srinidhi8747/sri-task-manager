
import React from "react";
import { Task } from "@/types/task";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import TaskHistoryList from "@/components/TaskHistoryList";
import { useTaskHistory } from "@/hooks/use-task-history";

interface TaskTabsProps {
  tasks: Task[];
  currentPage: number;
  onTasksChange: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  onEdit: (id: number, newTitle: string, newDescription?: string) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number) => void;
  onAdd: (title: string, description: string, startDate: Date | null, endDate: Date | null, priority: 'low' | 'medium' | 'high') => void;
}

const ITEMS_PER_PAGE = 10;

const TaskTabs: React.FC<TaskTabsProps> = ({
  tasks,
  currentPage,
  onTasksChange,
  onEdit,
  onDelete,
  onStatusChange,
  onAdd
}) => {
  const { deletedTasks, isLoading: isHistoryLoading } = useTaskHistory();
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
        <TabsTrigger value="history" className="flex-1">
          Task History ({deletedTasks.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending">
        <TaskInput onAdd={onAdd} isCompleted={false} />
        <TaskList 
          tasks={pendingTasks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          isCompleted={false}
        />
      </TabsContent>
      
      <TabsContent value="completed">
        <TaskList 
          tasks={completedTasks.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          isCompleted={true}
        />
      </TabsContent>

      <TabsContent value="history">
        {isHistoryLoading ? (
          <div className="text-center py-4">Loading history...</div>
        ) : (
          <TaskHistoryList deletedTasks={deletedTasks} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TaskTabs;
