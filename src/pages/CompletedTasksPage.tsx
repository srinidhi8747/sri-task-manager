
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import TaskHeader from "@/components/TaskHeader";
import TaskPagination from "@/components/TaskPagination";
import { exportTasksToExcel } from "@/utils/TaskExporter";
import { useTasks } from "@/hooks/use-tasks";
import TitleBar from "@/components/TitleBar";
import TaskManager from "@/components/TaskManager";

const ITEMS_PER_PAGE = 10;

const CompletedTasksPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const { tasks, setTasks, isLoading } = useTasks();

  // Filter for completed tasks only (tasks that have completed flag but no deletedAt)
  const completedTasks = tasks.filter(task => task.completed && !task.completedAt);

  const handleExport = async () => {
    await exportTasksToExcel([], completedTasks);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F1F0FB] p-4 w-full">
        <TitleBar />
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg mt-4">
          Loading tasks...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1F0FB] w-full">
      <TitleBar />
      <div className={`w-full max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${isMobile ? 'mt-4 mx-2' : 'mt-6 mx-auto'}`}>
        <TaskHeader onExport={handleExport} />
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-700">Completed Tasks</h2>
          <TaskManager
            tasks={completedTasks}
            onTasksChange={setTasks}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isCompleted={true}
          />
        </div>
        
        <TaskPagination 
          currentPage={currentPage}
          totalPages={Math.ceil(completedTasks.length / ITEMS_PER_PAGE)}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
};

export default CompletedTasksPage;
