
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaskInputProps {
  onAdd: (title: string) => void;
}

const TaskInput = ({ onAdd }: TaskInputProps) => {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim() === "") return;
    onAdd(title.trim());
    setTitle("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <Input
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-white shadow"
        maxLength={80}
        aria-label="Task title"
      />
      <Button onClick={handleAdd} aria-label="Add Task" size="icon" className="bg-primary text-white">
        <Plus />
      </Button>
    </div>
  );
};

export default TaskInput;
