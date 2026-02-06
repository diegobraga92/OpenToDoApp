import { TextInput, StyleSheet } from "react-native";
import { useState } from "react";

export function TaskInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [text, setText] = useState("");

  return (
    <TextInput
      placeholder="Add task..."
      value={text}
      onChangeText={setText}
      onSubmitEditing={() => {
        if (!text.trim()) return;
        onAdd(text);
        setText("");
      }}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
});
