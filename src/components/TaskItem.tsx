
import { useState } from "react";
import { Pencil, Trash2, Calendar as CalendarIcon, Clock as ClockIcon, User, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
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
        <Checkbox 
          checked={isCompleted}
          onCheckedChange={() => onStatusChange(task.id)}
          className="h-5 w-5"
        />
        
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
            <div className={cn("font-medium", isCompleted && "line-through text-gray-500")}>
              {task.title}
            </div>
          )}
        </div>
        
        <Badge className={priorityColors[task.priority]}>
          {task.priority}
        </Badge>

        {!isCompleted && !isEditing && (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label="Edit task">
            <Pencil size={18} />
          </Button>
        )}
        
        <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} aria-label="Delete task">
          <Trash2 size={18} className="text-red-500" />
        </Button>
      </div>
      
      <div className={cn("grid gap-2 mt-2 text-xs text-gray-500", 
        isMobile ? "grid-cols-1" : "grid-cols-4"
      )}>
        <div className="flex items-center gap-1">
          <CalendarIcon size={12} />
          {task.due ? format(new Date(task.due), "PPP") : "No due date"}
        </div>
        
        <div className="flex items-center gap-1">
          <User size={12} />
          {task.createdBy}
        </div>
        
        <div className="flex items-center gap-1">
          <ClockIcon size={12} />
          Created: {format(new Date(task.createdAt), "PPP")}
        </div>
        
        {task.completedAt && (
          <div className="flex items-center gap-1">
            <ClockIcon size={12} />
            Completed: {format(new Date(task.completedAt), "PPP")}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
