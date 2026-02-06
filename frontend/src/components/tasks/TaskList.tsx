import { TaskItem } from "./TaskItem";
import { TaskInput } from "./TaskInput";
import { Task } from "../../types/task";

type Props = {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
};

export function TaskList({ tasks, addTask, toggleTask }: Props) {
  return (
    <>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={() => toggleTask(task.id)}
        />
      ))}

      <TaskInput onAdd={addTask} />
    </>
  );
}
