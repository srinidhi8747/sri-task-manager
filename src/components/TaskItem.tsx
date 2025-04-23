
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TaskItemProps {
  task: { id: number; title: string };
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
      {isEditing ? (
        <Input
          value={editVal}
          onChange={e => setEditVal(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="flex-1 mr-2"
          autoFocus
        />
      ) : (
        <div className="flex-1 text-left">{task.title}</div>
      )}

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
