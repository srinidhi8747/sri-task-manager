
import { useState } from "react";
import { Pencil, Trash2, Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TaskItemProps {
  task: { id: number; title: string; due?: string | null };
  onEdit: (id: number, newTitle: string) => void;
  onDelete: (id: number) => void;
}

const TaskItem = ({ task, onEdit, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editVal, setEditVal] = useState(task.title);

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

  return (
    <div className="flex items-center bg-white rounded-lg mb-2 px-4 py-3 shadow transition-all group border border-gray-200">
      <div className="flex-1 flex flex-col text-left">
        {isEditing ? (
          <Input
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="mr-2"
            autoFocus
          />
        ) : (
          <div className="flex flex-col">
            <div>{task.title}</div>
            {(task.due && (
              <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                <CalendarIcon size={14} />
                {format(new Date(task.due), "PPP")}
                <ClockIcon size={14} className="ml-2" />
                {format(new Date(task.due), "p")}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label="Edit task">
            <Pencil size={18} />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)} aria-label="Delete task">
          <Trash2 size={18} className="text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
