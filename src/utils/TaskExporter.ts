
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Task } from "@/types/task";
import { toast } from "@/hooks/use-toast";

export const exportTasksToExcel = async (pendingTasks: Task[], completedTasks: Task[]) => {
  // Get the currently active tab
  const activeTab = document.querySelector('[data-state="active"]')?.getAttribute('value');
  
  // Check if there are tasks to export based on the active tab
  if (activeTab === 'pending' && pendingTasks.length === 0) {
    toast({
      title: "No tasks to export",
      description: "The pending tasks are zero",
      variant: "destructive",
    });
    return;
  }

  if (activeTab === 'completed' && completedTasks.length === 0) {
    toast({
      title: "No tasks to export",
      description: "The completed tasks are zero",
      variant: "destructive",
    });
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const tasksToExport = activeTab === 'pending' ? pendingTasks : completedTasks;
  
  const addSheet = (tasks: Task[], name: string) => {
    const sheet = workbook.addWorksheet(name);
    sheet.columns = [
      { header: "Sequence", key: "sequence", width: 10 },
      { header: "Title", key: "title", width: 40 },
      { header: "Description", key: "description", width: 40 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Created Date", key: "created", width: 20 },
      { header: "Created By", key: "createdBy", width: 20 },
      { header: "Due Date", key: "due", width: 20 },
      { header: "Completion Date", key: "completed", width: 20 },
    ];
    
    // Sort tasks by sequence in ascending order
    const sortedTasks = [...tasks].sort((a, b) => a.sequence - b.sequence);
    
    sortedTasks.forEach(task => {
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
        sequence: task.sequence,
        title: task.title,
        description: task.description || "No description",
        priority: task.priority,
        created: new Date(task.createdAt).toLocaleDateString(),
        createdBy: task.createdBy,
        due: dueDate,
        completed: completionDate
      });
    });
  };

  const tabName = activeTab === 'pending' ? "Pending Tasks" : "Completed Tasks";
  addSheet(tasksToExport, tabName);

  const buf = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `${tabName}.xlsx`);
  toast({ 
    title: "Excel exported!", 
    description: `Your ${tabName} were downloaded successfully.` 
  });
};
