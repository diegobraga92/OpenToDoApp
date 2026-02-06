import { useState } from "react";
import { ListItem } from "../../types/task";
import { uuid } from "../../utils/uuid";

export function useLists() {
  const [lists, setLists] = useState<ListItem[]>([]);

  return {
    lists,

    addList: (title: string) =>
      setLists((l) => [...l, { id: uuid(), title, items: [] }]),

    addSubItem: (listId: string, text: string) =>
      setLists((l) =>
        l.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: [
                  ...list.items,
                  { id: uuid(), text, done: false },
                ],
              }
            : list
        )
      ),

    toggleSubItem: (listId: string, itemId: string) =>
      setLists((l) =>
        l.map((list) =>
          list.id === listId
            ? {
                ...list,
                items: list.items.map((i) =>
                  i.id === itemId ? { ...i, done: !i.done } : i
                ),
              }
            : list
        )
      ),
  };
}
