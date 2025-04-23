
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Clock as ClockIcon, Flag } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Priority } from "@/types/task";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskInputProps {
  onAdd: (title: string, due: Date | null, priority: Priority) => void;
}

const TaskInput = ({ onAdd }: TaskInputProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("medium");
  const isMobile = useIsMobile();

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
    onAdd(title.trim(), due, priority);
    setTitle("");
    setDate(undefined);
    setTime("");
    setPriority("medium");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <Input
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-white shadow"
        maxLength={80}
        aria-label="Task title"
      />
      
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {date ? format(date, "PPP") : "Due Date"}
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
          placeholder="Time"
        />
        
        <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
          <SelectTrigger className="w-[120px]">
            <Flag className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={handleAdd} aria-label="Add Task" className="bg-primary text-white ml-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Task
        </Button>
      </div>
    </div>
  );
};

export default TaskInput;
