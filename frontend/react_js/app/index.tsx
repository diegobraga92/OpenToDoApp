import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";

const API_URL = "http://192.168.122.50:3000";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

export default function App() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  async function addTodo() {
    if (!text.trim()) return;

    const res = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const todo = await res.json();
    setTodos([...todos, todo]);
    setText("");
  }


  async function toggleTodo(id: string) {
    const res = await fetch(`${API_URL}/todos/${id}`, {
      method: "PATCH",
    });

    const updated = await res.json();
    setTodos(todos.map(t => (t.id === id ? updated : t)));
  }

  async function deleteTodo(id: string) {
    await fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
    });

    setTodos(todos.filter(t => t.id !== id));
  }

  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then(res => res.json())
      .then(setTodos)
      .catch(console.error);
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do</Text>

      <View style={styles.inputRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="New task"
          style={styles.input}
        />
        <Pressable onPress={addTodo} style={styles.addBtn}>
          <Text style={styles.addText}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={todos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoRow}>
            <Pressable onPress={() => toggleTodo(item.id)}>
              <Text
                style={[
                  styles.todoText,
                  item.done && styles.done,
                ]}
              >
                {item.text}
              </Text>
            </Pressable>

            <Pressable onPress={() => deleteTodo(item.id)}>
              <Text style={styles.delete}>✕</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
  },
  addBtn: {
    marginLeft: 8,
    backgroundColor: "#000",
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addText: {
    color: "#fff",
    fontSize: 20,
  },
  todoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  todoText: {
    fontSize: 18,
  },
  done: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  delete: {
    fontSize: 18,
    color: "#c00",
  },
});
