import { ScrollView, StyleSheet, Platform } from "react-native";
import { Column } from "../components/layout/Column";
import { ScreenContainer } from "../components/layout/ScreenContainer";
import { TaskList } from "../components/tasks/TaskList";
import { ListColumn } from "../components/lists/ListColumn";

import { useDailyTasks } from "../features/dailyTasks/useDailyTasks";
import { useTodos } from "../features/todos/useTodos";
import { useLists } from "../features/lists/useLists";

export function HomeScreen() {
  const daily = useDailyTasks();
  const todos = useTodos();
  const lists = useLists();

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          Platform.OS === "web" && styles.web,
        ]}
      >
        <Column title="Daily Tasks">
          <TaskList {...daily} />
        </Column>

        <Column title="To Dos">
          <TaskList {...todos} />
        </Column>

        <Column title="Lists">
          <ListColumn {...lists} />
        </Column>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  web: {
    flexDirection: "row",
  },
});
