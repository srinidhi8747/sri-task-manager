
import TaskItem from "./TaskItem";
import { Task, Priority, SortField, SortDirection } from "@/types/task";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUp, ArrowDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskListProps {
  tasks: Task[];
  onEdit: (id: number, newTitle: string) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number) => void;
  isCompleted: boolean;
}

const TaskList = ({ tasks, onEdit, onDelete, onStatusChange, isCompleted }: TaskListProps) => {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const isMobile = useIsMobile();

  if (tasks.length === 0) {
    return (
      <div className="text-gray-400 text-center py-12">
        {isCompleted ? "No completed tasks yet." : "No pending tasks. You're all caught up! 🎉"}
      </div>
    );
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedAndFilteredTasks = [...tasks]
    .filter(task => priorityFilter === "all" ? true : task.priority === priorityFilter)
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "priority":
          const priorityValues = { high: 3, medium: 2, low: 1 };
          comparison = priorityValues[a.priority] - priorityValues[b.priority];
          break;
        case "createdAt":
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "due":
          const aDate = a.due ? new Date(a.due).getTime() : Number.MAX_SAFE_INTEGER;
          const bDate = b.due ? new Date(b.due).getTime() : Number.MAX_SAFE_INTEGER;
          comparison = aDate - bDate;
          break;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700">
          {isCompleted ? "Completed Tasks" : "Pending Tasks"}
          <span className="ml-2 text-gray-500">({sortedAndFilteredTasks.length})</span>
        </h3>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSort("title")}>
                Title {sortField === "title" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                Created Date {sortField === "createdAt" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("priority")}>
                Priority {sortField === "priority" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("due")}>
                Due Date {sortField === "due" && (
                  sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />
                )}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
              <div className="p-2">
                <RadioGroup value={priorityFilter} onValueChange={(value) => setPriorityFilter(value as Priority | "all")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low</Label>
                  </div>
                </RadioGroup>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-2">
        {sortedAndFilteredTasks.map((task) => (
          <TaskItem 
            key={task.id} 
            task={task} 
            onEdit={onEdit} 
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            isCompleted={isCompleted}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
