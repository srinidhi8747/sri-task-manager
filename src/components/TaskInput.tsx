
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, Flag } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface TaskInputProps {
  onAdd: (title: string, description: string, startDate: Date | null, endDate: Date | null, priority: Priority) => void;
  isCompleted: boolean;
}

const TaskInput = ({ onAdd, isCompleted }: TaskInputProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState<Priority>("medium");
  const isMobile = useIsMobile();

  if (isCompleted) return null;

  const handleAdd = () => {
    if (title.trim() === "") return;
    onAdd(
      title.trim(),
      description.trim(),
      startDate || null,
      endDate || null,
      priority
    );
    setTitle("");
    setDescription("");
    setStartDate(undefined);
    setEndDate(undefined);
    setPriority("medium");
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <Input
        placeholder="Task title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 bg-white shadow"
        maxLength={100}
        aria-label="Task title"
      />
      
      <Textarea
        placeholder="Task description (optional)..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="flex-1 bg-white shadow min-h-[100px]"
        maxLength={500}
        aria-label="Task description"
      />
      
      <div className="flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {startDate ? format(startDate, "PPP") : "Start Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {endDate ? format(endDate, "PPP") : "End Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
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
