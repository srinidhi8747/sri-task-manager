
import { useState } from "react";
import { Pencil, Trash2, Calendar as CalendarIcon, User, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskItemProps {
  task: Task;
  onEdit: (id: number, newTitle: string) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number) => void;
  isCompleted: boolean;
}

const TaskItem = ({ task, onEdit, onDelete, onStatusChange, isCompleted }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(task.title);
  const isMobile = useIsMobile();

  const handleSave = () => {
    if (editVal.trim() && editVal !== task.title) {
      onEdit(task.id, editVal.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditVal(task.title);
      setIsEditing(false);
    }
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };

  return (
    <div className={cn(
      "flex flex-col bg-white rounded-lg mb-2 px-4 py-3 shadow transition-all group border border-gray-200",
      isCompleted && "bg-gray-50"
    )}>
      <div className="flex items-center gap-3">
        <span className="text-gray-500 font-medium min-w-[24px]">{task.sequence}.</span>
        
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={editVal}
              onChange={e => setEditVal(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="mr-2"
              autoFocus
              disabled={isCompleted}
            />
          ) : (
            <div className={cn("font-medium", isCompleted && "text-gray-500")}>
              {task.title}
            </div>
          )}
        </div>
        
        <Badge className={priorityColors[task.priority]}>
          {task.priority}
        </Badge>

        {!isCompleted && (
          <>
            {!isEditing && (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label="Edit task">
                <Pencil size={18} />
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => onStatusChange(task.id)}>
              Mark as completed
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} aria-label="Delete task">
              <Trash2 size={18} className="text-red-500" />
            </Button>
          </>
        )}
        
        {isCompleted && (
          <Button variant="outline" size="sm" onClick={() => onStatusChange(task.id)}>
            Mark as pending
          </Button>
        )}
      </div>
      
      <div className={cn("grid gap-2 mt-2 text-xs text-gray-500", 
        isMobile ? "grid-cols-1" : "grid-cols-4"
      )}>
        <div className="flex items-center gap-1">
          <CalendarIcon size={12} />
          Start: {task.startDate ? format(new Date(task.startDate), "PPP") : "No start date"}
        </div>
        
        <div className="flex items-center gap-1">
          <CalendarIcon size={12} />
          End: {task.endDate ? format(new Date(task.endDate), "PPP") : "No end date"}
        </div>
        
        <div className="flex items-center gap-1">
          <User size={12} />
          {task.createdBy}
        </div>
        
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {isCompleted ? `Completed: ${format(new Date(task.completedAt!), "PPP")}` : 
           `Created: ${format(new Date(task.createdAt), "PPP")}`}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
