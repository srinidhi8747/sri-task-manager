
import TaskItem from "./TaskItem";

interface Task {
  id: number;
  title: string;
  due?: string | null;
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (id: number, newTitle: string) => void;
  onDelete: (id: number) => void;
}

const TaskList = ({ tasks, onEdit, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-gray-400 text-center py-12">
        No tasks yet. You're all caught up! 🎉
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default TaskList;
