import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Task } from "../../types/task";

export function TaskItem({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.item}>
      <Text style={task.done && styles.done}>
        {task.done ? "✓ " : "○ "} {task.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 4,
  },
  done: {
    textDecorationLine: "line-through",
    color: "#777",
  },
});
