
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Task } from "@/types/task";
import TaskHeader from "@/components/TaskHeader";
import TaskManager from "@/components/TaskManager";
import TaskPagination from "@/components/TaskPagination";
import { exportTasksToExcel } from "@/utils/TaskExporter";

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = "tasks_v1"; // Using a versioned key
const SYNC_INTERVAL = 3000; // Check more frequently (every 3 seconds)

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
          console.log("Updating tasks from localStorage");
          setTasks(parsedTasks);
        }
      } catch (e) {
        console.error("Error parsing tasks from localStorage:", e);
        // Reset to empty array if data is corrupted
        setTasks([]);
      }
    }
  };

  // Helper function to save tasks to localStorage
  const saveTasks = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (e) {
      console.error("Error saving tasks to localStorage:", e);
    }
  };

  // Load tasks on mount and set up sync mechanisms
  useEffect(() => {
    // Load tasks initially
    loadTasks();

    // Set up more frequent periodic sync
    const syncInterval = setInterval(() => {
      loadTasks();
    }, SYNC_INTERVAL);

    // Sync when tab/window becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Document became visible, reloading tasks");
        loadTasks();
      }
    };

    // Add event listener for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        console.log("Storage changed in another tab/window");
        try {
          const parsedTasks = JSON.parse(e.newValue);
          setTasks(parsedTasks);
        } catch (err) {
          console.error("Error parsing tasks from storage event:", err);
        }
      }
    };

    const handleFocus = () => {
      console.log("Window focused, reloading tasks");
      loadTasks();
    };

    const handlePageShow = () => {
      console.log("Page shown (back navigation), reloading tasks");
      loadTasks();
    };

    // Listen for various events that might indicate we need to refresh data
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('online', loadTasks);

    // Clean up on unmount
    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('online', loadTasks);
    };
  }, []); // Removed tasks from dependency array to prevent unnecessary re-renders

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      console.log("Saving tasks to localStorage");
      saveTasks(tasks);
    }
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
