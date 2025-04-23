
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Clock as ClockIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface TaskInputProps {
  onAdd: (title: string, due: Date | null) => void;
}

const TaskInput = ({ onAdd }: TaskInputProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");

  const handleAdd = () => {
    if (title.trim() === "") return;
    let due: Date | null = null;
    if (date) {
      due = new Date(date);
      if (time) {
        const [h, m] = time.split(":");
        due.setHours(Number(h));
        due.setMinutes(Number(m));
      }
    }
    onAdd(title.trim(), due);
    setTitle("");
    setDate(undefined);
    setTime("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      <Input
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-white shadow"
        maxLength={80}
        aria-label="Task title"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="bg-white" aria-label="Pick due date">
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
      <Input
        type="time"
        aria-label="Due time"
        value={time}
        onChange={e => setTime(e.target.value)}
        className="w-[110px]"
      />
      <Button onClick={handleAdd} aria-label="Add Task" size="icon" className="bg-primary text-white">
        <Plus />
      </Button>
    </div>
  );
};

export default TaskInput;
