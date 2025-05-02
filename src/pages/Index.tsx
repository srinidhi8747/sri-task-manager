
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import TaskHeader from "@/components/TaskHeader";
import TaskManager from "@/components/TaskManager";
import TaskPagination from "@/components/TaskPagination";
import { exportTasksToExcel } from "@/utils/TaskExporter";
import { useTasks } from "@/hooks/use-tasks";
import TitleBar from "@/components/TitleBar";
import { useLocation } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const { tasks, setTasks, isLoading } = useTasks();
  const location = useLocation();

  const handleExport = async () => {
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    await exportTasksToExcel(pendingTasks, completedTasks);
  };
  
  // Get tasks based on current route
  const getVisibleTasks = () => {
    switch (location.pathname) {
      case '/pending':
        return tasks.filter(task => !task.completed);
      case '/completed':
        return tasks.filter(task => task.completed);
      case '/history':
        return tasks.filter(task => task.completedAt);
      default:
        return tasks.filter(task => !task.completed);
    }
  };

  const visibleTasks = getVisibleTasks();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F1F0FB] p-4">
        <TitleBar />
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg mt-4">
          Loading tasks...
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-[#F1F0FB]`}>
      <TitleBar />
      <div className={`w-full max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${isMobile ? 'mt-4 mx-4' : 'mt-6 mx-6'}`}>
        <TaskHeader onExport={handleExport} />
        <TaskManager 
          tasks={tasks}
          onTasksChange={setTasks}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <TaskPagination 
          currentPage={currentPage}
          totalPages={Math.ceil(visibleTasks.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
};

export default Index;
