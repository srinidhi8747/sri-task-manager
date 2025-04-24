
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import TaskHeader from "@/components/TaskHeader";
import TaskManager from "@/components/TaskManager";
import TaskPagination from "@/components/TaskPagination";
import { exportTasksToExcel } from "@/utils/TaskExporter";
import { useTasks } from "@/hooks/use-tasks";

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const { tasks, setTasks, isLoading } = useTasks();

  const handleExport = async () => {
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    await exportTasksToExcel(pendingTasks, completedTasks);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F1F0FB] p-4">
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
          Loading tasks...
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-[#F1F0FB] ${isMobile ? 'p-4' : 'px-6 py-8'}`}>
      <div className={`w-full max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-100`}>
        <TaskHeader onExport={handleExport} />
        <TaskManager 
          tasks={tasks}
          onTasksChange={setTasks}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <TaskPagination 
          currentPage={currentPage}
          totalPages={Math.ceil(tasks.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
};

export default Index;
