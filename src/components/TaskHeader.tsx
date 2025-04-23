
import React from "react";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskHeaderProps {
  onExport: () => void;
}

const TaskHeader = ({ onExport }: TaskHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-1 text-[#9b87f5] tracking-tight">
          Mini Task Hub
        </h1>
        <p className="text-gray-500 text-sm">
          A simple place to organize your tasks.
        </p>
      </div>
      
      <Button
        variant="default"
        onClick={onExport}
        aria-label="Export tasks"
        size={isMobile ? "sm" : "default"}
        className="bg-primary hover:bg-primary/90"
      >
        <FileX className="h-4 w-4 mr-2" /> Export the tasks
      </Button>
    </div>
  );
};

export default TaskHeader;
