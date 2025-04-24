
import React from "react";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface DeletedTask extends Task {
  deletedAt: string;
  deletedBy: string;
}

interface TaskHistoryListProps {
  deletedTasks: DeletedTask[];
}

const TaskHistoryList: React.FC<TaskHistoryListProps> = ({ deletedTasks }) => {
  const isMobile = useIsMobile();

  if (deletedTasks.length === 0) {
    return (
      <div className="text-gray-400 text-center py-12">
        No deleted tasks history.
      </div>
    );
  }

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };

  return (
    <div className="space-y-2">
      {deletedTasks.map((task) => (
        <div 
          key={`${task.id}-${task.deletedAt}`}
          className="bg-gray-50 rounded-lg p-4 border border-gray-200"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gray-500 font-medium min-w-[24px]">{task.sequence}.</span>
            <div className="flex-1 min-w-[200px] font-medium text-gray-500">
              {task.title}
            </div>
            <Badge className={priorityColors[task.priority]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
          
          {task.description && (
            <div className="mt-2 pl-8 text-sm text-gray-500">
              {task.description}
            </div>
          )}
          
          <div className={cn(
            "grid gap-2 mt-2 text-xs text-gray-500",
            isMobile ? "grid-cols-2" : "grid-cols-4"
          )}>
            <div>Created: {format(new Date(task.createdAt), "PPP")}</div>
            <div>Deleted: {format(new Date(task.deletedAt), "PPP")}</div>
            <div>Created by: {task.createdBy}</div>
            <div>Deleted by: {task.deletedBy}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskHistoryList;
