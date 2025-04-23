
import { useState } from "react";
import TaskInput from "@/components/TaskInput";
import TaskList from "@/components/TaskList";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileX, Download } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  due?: string | null;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<Task[]>([]);

  const addTask = (title: string, due: Date | null) => {
    setTasks(prev => {
      const newTask = { id: Date.now(), title, due: due ? due.toISOString() : null };
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
    if (taskToDelete) setHistory(prev => [{ ...taskToDelete }, ...prev]);
    toast({
      title: "Task deleted",
      description: `"${taskToDelete?.title ?? "Task"}" has been deleted.`,
      variant: "destructive",
    });
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const addSheet = (tasksToExport: Task[], name: string) => {
      const sheet = workbook.addWorksheet(name);
      sheet.columns = [
        { header: "Title", key: "title", width: 40 },
        { header: "Due date", key: "due", width: 20 },
        { header: "Due time", key: "time", width: 16 }
      ];
      tasksToExport.forEach(task => {
        let dateDisplay = "", timeDisplay = "";
        if (task.due) {
          const dateObj = new Date(task.due);
          dateDisplay = dateObj.toLocaleDateString();
          timeDisplay = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
        sheet.addRow({
          title: task.title,
          due: dateDisplay,
          time: timeDisplay
        });
      });
    };
    addSheet(tasks, "Current Tasks");
    addSheet(history, "History Tasks");

    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), "tasks.xlsx");
    toast({ title: "Excel exported!", description: "Your tasks were downloaded." });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F1F0FB] px-2">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 text-[#9b87f5] tracking-tight">
              Mini Task Hub
            </h1>
            <p className="text-gray-500 text-sm">
              A simple place to organize your tasks.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs"
            >
              <Link to="/sparkles">View Theme</Link>
            </Button>
            <Button
              variant="outline"
              className="ml-2"
              onClick={exportToExcel}
              aria-label="Download all tasks"
            >
              <FileX className="mr-2" /> <Download className="mr-1" /> Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks">
            <TaskInput onAdd={addTask} />
            <TaskList tasks={tasks} onEdit={editTask} onDelete={deleteTask} />
          </TabsContent>
          <TabsContent value="history">
            <TaskList
              tasks={history}
              onEdit={() => {}}
              onDelete={() => {}}
            />
            {history.length === 0 && (
              <div className="text-gray-400 text-center py-12">No history yet.</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Index;
