import { View, Text, StyleSheet } from "react-native";
import { ListCard } from "./ListCard";
import { TaskInput } from "../tasks/TaskInput";
import { ListItem } from "../../types/task";

type Props = {
  lists: ListItem[];
  addList: (title: string) => void;
  addSubItem: (listId: string, text: string) => void;
  toggleSubItem: (listId: string, itemId: string) => void;
};

export function ListColumn({
  lists,
  addList,
  addSubItem,
  toggleSubItem,
}: Props) {
  return (
    <>
      {lists.map((list) => (
        <ListCard
          key={list.id}
          list={list}
          onAddItem={(text) => addSubItem(list.id, text)}
          onToggleItem={(itemId) => toggleSubItem(list.id, itemId)}
        />
      ))}

      <TaskInput onAdd={addList} />
    </>
  );
}
