import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TaskInput } from "../tasks/TaskInput";
import { ListItem } from "../../types/task";

export function ListCard({
  list,
  onAddItem,
  onToggleItem,
}: {
  list: ListItem;
  onAddItem: (text: string) => void;
  onToggleItem: (itemId: string) => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{list.title}</Text>

      {list.items.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => onToggleItem(item.id)}
        >
          <Text style={item.done && styles.done}>
            {item.done ? "✓ " : "• "} {item.text}
          </Text>
        </TouchableOpacity>
      ))}

      <TaskInput onAdd={onAddItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e8e8e8",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  done: {
    textDecorationLine: "line-through",
    color: "#777",
  },
});
