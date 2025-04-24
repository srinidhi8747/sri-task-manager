
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Task } from "@/types/task";
import TaskHeader from "@/components/TaskHeader";
import TaskManager from "@/components/TaskManager";
import TaskPagination from "@/components/TaskPagination";
import { exportTasksToExcel } from "@/utils/TaskExporter";
import { toast } from "@/hooks/use-toast";
import SyncService from "@/services/syncService";

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = "tasks_v1"; // Using a versioned key
const SYNC_INTERVAL = 500; // Check more frequently (every 0.5s)

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());
  const [syncService] = useState(() => SyncService.getInstance());

  // Function to load tasks from localStorage
  const loadTasks = () => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        const localLastModified = localStorage.getItem("tasks_last_modified");
        
        // Only update if local data is newer or different
        if (
          !localLastModified || 
          parseInt(localLastModified) > lastSyncTime || 
          JSON.stringify(parsedTasks) !== JSON.stringify(tasks)
        ) {
          console.log("Updating tasks from localStorage", new Date().toISOString());
          setTasks(parsedTasks);
          if (localLastModified) {
            setLastSyncTime(parseInt(localLastModified));
          }
        }
      } catch (e) {
        console.error("Error parsing tasks from localStorage:", e);
        // Reset to empty array if data is corrupted
        setTasks([]);
      }
    }
  };

  // Helper function to save tasks to localStorage and sync
  const saveTasks = (updatedTasks: Task[]) => {
    try {
      const timeNow = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
      localStorage.setItem("tasks_last_modified", timeNow.toString());
      setLastSyncTime(timeNow);
      
      // Broadcast the change to other tabs/windows/devices
      syncService.sendMessage({ 
        tasks: updatedTasks, 
        timestamp: timeNow 
      });
      
      console.log("Tasks saved and synced:", timeNow);
    } catch (e) {
      console.error("Error saving tasks to localStorage:", e);
    }
  };

  // Set up the sync service subscription
  useEffect(() => {
    // Subscribe to sync events
    const unsubscribe = syncService.subscribe((data) => {
      console.log("Sync event received:", data);
      if (data.timestamp > lastSyncTime) {
        console.log("Updating tasks from sync event");
        setTasks(data.tasks);
        setLastSyncTime(data.timestamp);
      }
    });

    // Show feedback to the user
    toast({
      title: "Sync enabled",
      description: "Your tasks will be synchronized across devices",
    });
    
    return () => {
      unsubscribe();
    };
  }, [syncService, lastSyncTime]);

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

    const handlePageShow = (e: PageTransitionEvent) => {
      console.log("Page shown (back navigation), reloading tasks", e.persisted);
      loadTasks();
    };

    const handleOnline = () => {
      console.log("Device is online, reloading tasks");
      loadTasks();
    };

    // Listen for various events that might indicate we need to refresh data
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('online', handleOnline);
    window.addEventListener('popstate', loadTasks);
    window.addEventListener('resize', loadTasks); // Sometimes indicates app switching on mobile

    // More aggressive refresh on mobile
    if (isMobile) {
      // Force refresh more aggressively on mobile
      const touchInterval = setInterval(() => {
        console.log("Mobile touch interval check");
        loadTasks();
      }, 2000); // Every 2 seconds on mobile
      
      return () => {
        clearInterval(syncInterval);
        clearInterval(touchInterval);
        window.removeEventListener('storage', handleStorageChange);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('pageshow', handlePageShow);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('popstate', loadTasks);
        window.removeEventListener('resize', loadTasks);
      };
    }
    
    // Clean up on unmount
    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('popstate', loadTasks);
      window.removeEventListener('resize', loadTasks);
    };
  }, [isMobile]); // Only re-run when isMobile changes

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      console.log("Saving tasks to localStorage", new Date().toISOString());
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
