
import { useState, useEffect } from "react";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileX, Download } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Task, Priority } from "@/types/task";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const isMobile = useIsMobile();

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, startDate: Date | null, endDate: Date | null, priority: Priority) => {
    setTasks(prev => {
      const sequence = prev.length + 1;
      const newTask: Task = { 
        id: Date.now(), 
        sequence,
        title, 
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        completed: false,
        createdAt: new Date().toISOString(),
        createdBy: "Current User", // In a real app, this would come from auth
        priority: priority,
        completedAt: null
      };
      
      toast({ title: "Task added!", description: `"${title}" has been added.` });
      return [newTask, ...prev];
    });
  };

  const editTask = (id: number, newTitle: string) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, title: newTitle } : task))
    );
    toast({ title: "Task updated!", description: `Task changed to "${newTitle}".` });
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: `"${taskToDelete?.title ?? "Task"}" has been deleted.`,
      variant: "destructive",
    });
  };

  const toggleTaskStatus = (id: number) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? {
              ...task, 
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null
            }
          : task
      )
    );
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      if (!task.completed) {
        toast({ title: "Task completed!", description: `"${task.title}" marked as completed.` });
      } else {
        toast({ title: "Task reopened!", description: `"${task.title}" moved back to pending.` });
      }
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    
    const addSheet = (tasksToExport: Task[], name: string) => {
      const sheet = workbook.addWorksheet(name);
      sheet.columns = [
        { header: "Title", key: "title", width: 40 },
        { header: "Priority", key: "priority", width: 15 },
        { header: "Created Date", key: "created", width: 20 },
        { header: "Created By", key: "createdBy", width: 20 },
        { header: "Due Date", key: "due", width: 20 },
        { header: "Completion Date", key: "completed", width: 20 },
      ];
      
      tasksToExport.forEach(task => {
        let dueDate = "", completionDate = "";
        
        if (task.endDate) {
          const dateObj = new Date(task.endDate);
          dueDate = dateObj.toLocaleDateString();
        }
        
        if (task.completedAt) {
          const dateObj = new Date(task.completedAt);
          completionDate = dateObj.toLocaleDateString();
        }
        
        sheet.addRow({
          title: task.title,
          priority: task.priority,
          created: new Date(task.createdAt).toLocaleDateString(),
          createdBy: task.createdBy,
          due: dueDate,
          completed: completionDate
        });
      });
    };
    
    addSheet(pendingTasks, "Pending Tasks");
    addSheet(completedTasks, "Completed Tasks");

    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), "tasks.xlsx");
    toast({ title: "Excel exported!", description: "Your tasks were downloaded." });
  };

  return (
    <main className={`min-h-screen bg-[#F1F0FB] ${isMobile ? 'p-4' : 'px-6 py-8'}`}>
      <div className={`w-full max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg border border-gray-100`}>
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
            variant="outline"
            onClick={exportToExcel}
            aria-label="Download all tasks"
            size={isMobile ? "sm" : "default"}
          >
            <FileX className="h-4 w-4 mr-2" /> <Download className="h-4 w-4 mr-1" /> Export
          </Button>
        </div>

        <TaskInput onAdd={addTask} />

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="pending" className="flex-1">Pending Tasks ({pendingTasks.length})</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1">Completed Tasks ({completedTasks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <TaskList 
              tasks={pendingTasks}
              onEdit={editTask}
              onDelete={deleteTask}
              onStatusChange={toggleTaskStatus}
              isCompleted={false}
            />
          </TabsContent>
          
          <TabsContent value="completed">
            <TaskList 
              tasks={completedTasks}
              onEdit={editTask}
              onDelete={deleteTask}
              onStatusChange={toggleTaskStatus}
              isCompleted={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Index;
