import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Task } from "@/types/task";
import { toast } from "@/hooks/use-toast";

export const exportTasksToExcel = async (pendingTasks: Task[], completedTasks: Task[]) => {
  if (pendingTasks.length === 0 && completedTasks.length === 0) {
    toast({
      title: "No tasks to export",
      description: "There are no tasks available to export.",
      variant: "destructive",
    });
    return;
  }

  const workbook = new ExcelJS.Workbook();
  
  const addSheet = (tasksToExport: Task[], name: string) => {
    const sheet = workbook.addWorksheet(name);
    sheet.protect('password123', {
      selectLockedCells: false,
      selectUnlockedCells: false,
      formatCells: false,
      formatColumns: false,
      formatRows: false,
      insertColumns: false,
      insertRows: false,
      insertHyperlinks: false,
      deleteColumns: false,
      deleteRows: false,
      sort: false,
      autoFilter: false,
      pivotTables: false
    });
    
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
  
  if (pendingTasks.length > 0) {
    addSheet(pendingTasks, "Pending Tasks");
  }
  if (completedTasks.length > 0) {
    addSheet(completedTasks, "Completed Tasks");
  }

  if (workbook.worksheets.length > 0) {
    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), "tasks.xlsx");
    toast({ title: "Excel exported!", description: "Your tasks were downloaded." });
  } else {
    toast({
      title: "No tasks to export",
      description: "There are no tasks available to export.",
      variant: "destructive",
    });
  }
};
