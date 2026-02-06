export type Task = {
  id: string;
  text: string;
  done: boolean;
};

export type ListItem = {
  id: string;
  title: string;
  items: Task[];
};
