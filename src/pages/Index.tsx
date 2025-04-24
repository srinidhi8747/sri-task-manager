
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Task } from "@/types/task";
import TaskHeader from "@/components/TaskHeader";
import TaskManager from "@/components/TaskManager";
import TaskPagination from "@/components/TaskPagination";
import { exportTasksToExcel } from "@/utils/TaskExporter";

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = "tasks_v1"; // Using a versioned key
const SYNC_INTERVAL = 5000; // Check for updates every 5 seconds

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

  // Function to load tasks from localStorage
  const loadTasks = () => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Only update state if the data is actually different
        if (JSON.stringify(parsedTasks) !== JSON.stringify(tasks)) {
          setTasks(parsedTasks);
        }
      } catch (e) {
        console.error("Error parsing tasks from localStorage:", e);
        // Reset to empty array if data is corrupted
        setTasks([]);
      }
    }
  };

  // Load tasks on mount and set up sync mechanisms
  useEffect(() => {
    // Load tasks initially
    loadTasks();

    // Set up periodic sync
    const syncInterval = setInterval(() => {
      loadTasks();
    }, SYNC_INTERVAL);

    // Sync when tab/window becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadTasks();
      }
    };

    // Add event listener for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsedTasks = JSON.parse(e.newValue);
          setTasks(parsedTasks);
        } catch (err) {
          console.error("Error parsing tasks from storage event:", err);
        }
      }
    };

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', loadTasks);

    // Clean up on unmount
    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', loadTasks);
    };
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleExport = async () => {
    const pendingTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    await exportTasksToExcel(pendingTasks, completedTasks);
  };

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);

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
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </main>
  );
};

export default Index;
