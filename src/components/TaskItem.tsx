
import { useState } from "react";
import { Pencil, Trash2, Calendar, User, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Task } from "@/types/task";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onEdit: (id: number, newTitle: string, newDescription?: string) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number) => void;
  isCompleted: boolean;
}

const TaskItem = ({ task, onEdit, onDelete, onStatusChange, isCompleted }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editVal, setEditVal] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || "");
  const [showDescription, setShowDescription] = useState(false);
  const isMobile = useIsMobile();

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    high: "bg-red-100 text-red-800 hover:bg-red-100"
  };

  const priorityLabels = {
    low: "Low",
    medium: "Medium",
    high: "High"
  };

  const handleSave = () => {
    if (editVal.trim() && editVal !== task.title) {
      onEdit(task.id, editVal.trim());
    }
    setIsEditing(false);
  };

  const handleSaveDesc = () => {
    if (editDesc.trim() !== task.description) {
      onEdit(task.id, task.title, editDesc.trim());
    }
    setIsEditingDesc(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditVal(task.title);
      setIsEditing(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-white rounded-lg mb-2 px-4 py-3 shadow transition-all group border border-gray-200",
      isCompleted && "bg-gray-50"
    )}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-gray-500 font-medium min-w-[24px]">{task.sequence}.</span>
        
        <div className="flex-1 min-w-[200px]">
          {isEditing ? (
            <Input
              value={editVal}
              onChange={e => setEditVal(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="mr-2 h-8 max-w-[200px]"
              autoFocus
              disabled={isCompleted}
            />
          ) : (
            <div className={cn("font-medium", isCompleted && "text-gray-500")}>
              {task.title}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={priorityColors[task.priority]}>
            {priorityLabels[task.priority]}
          </Badge>

          {task.description && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDescription(!showDescription)}
              className="min-w-[120px] text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100"
            >
              {showDescription ? "Hide Description" : "View Description"}
            </Button>
          )}

          {!isCompleted ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onStatusChange(task.id)}
                className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                Complete
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-blue-50"
                onClick={() => setIsEditing(true)}
                aria-label="Edit task"
              >
                <Pencil size={18} className="text-blue-500" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(task.id)} 
                aria-label="Delete task"
                className="hover:bg-red-50"
              >
                <Trash2 size={18} className="text-red-500" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onStatusChange(task.id)}
                className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
              >
                Pending
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(task.id)} 
                aria-label="Delete task"
                className="hover:bg-red-50"
              >
                <Trash2 size={18} className="text-red-500" />
              </Button>
            </>
          )}
        </div>
      </div>
      
      {showDescription && task.description && (
        <div className="mt-2 pl-8 pr-2 text-sm text-gray-600 whitespace-pre-wrap border-t border-gray-100 pt-2">
          <div className="flex justify-between items-start gap-2">
            {isEditingDesc ? (
              <div className="flex-1">
                <Textarea
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  onBlur={handleSaveDesc}
                  className="min-h-[60px] text-sm"
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleSaveDesc}
                  >
                    Save
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      setEditDesc(task.description || "");
                      setIsEditingDesc(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1">{task.description}</div>
            )}
            <div className="flex gap-1 shrink-0">
              {!isCompleted && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 hover:bg-blue-50"
                  onClick={() => setIsEditingDesc(true)}
                  aria-label="Edit description"
                >
                  <Pencil size={14} className="text-blue-500" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 hover:bg-red-50"
                onClick={() => onDelete(task.id)} 
                aria-label="Delete task"
              >
                <Trash2 size={14} className="text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className={cn(
        "grid gap-2 mt-2 text-xs text-gray-500", 
        isMobile ? "grid-cols-2" : "grid-cols-4"
      )}>
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          Start: {task.startDate ? format(new Date(task.startDate), "PPP") : "No start date"}
        </div>
        
        <div className="flex items-center gap-1">
          <Calendar size={12} />
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
