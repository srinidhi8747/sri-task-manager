
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import TaskHeader from "@/components/TaskHeader";
import TaskPagination from "@/components/TaskPagination";
import { exportTasksToExcel } from "@/utils/TaskExporter";
import { useTasks } from "@/hooks/use-tasks";
import TitleBar from "@/components/TitleBar";
import TaskList from "@/components/TaskList";
import { useTaskManager } from "@/hooks/use-task-manager";

const ITEMS_PER_PAGE = 5; // Changed to 5 items per page

const CompletedTasksPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const { tasks, setTasks, isLoading } = useTasks();
  const { editTask, deleteTask, toggleTaskStatus } = useTaskManager(tasks, setTasks);

  // Filter for completed tasks only (tasks that have completed=true)
  const completedTasks = tasks.filter(task => task.completed);
  
  // Update the sequence numbers in ascending order (1, 2, 3...)
  useEffect(() => {
    if (!isLoading && completedTasks.length > 0) {
      const tasksWithFixedSequence = completedTasks.map((task, index) => ({
        ...task,
        sequence: index + 1
      }));
      
      // Only update if sequences are different
      const needsUpdate = tasksWithFixedSequence.some(
        (task, i) => task.sequence !== completedTasks[i].sequence
      );
      
      if (needsUpdate) {
        setTasks(current => 
          current.map(task => {
            if (task.completed) {
              const updatedTask = tasksWithFixedSequence.find(t => t.id === task.id);
              return updatedTask || task;
            }
            return task;
          })
        );
      }
    }
  }, [completedTasks, isLoading, setTasks]);

  // Get paginated tasks for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTasks = completedTasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          <TaskList 
            tasks={paginatedTasks}
            onEdit={editTask}
            onDelete={deleteTask}
            onStatusChange={toggleTaskStatus}
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
