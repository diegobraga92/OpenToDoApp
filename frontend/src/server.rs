use crate::models::Todo;
use leptos::*;

#[server(GetTodos)]
pub async fn get_todos() -> Result<Vec<Todo>, ServerFnError> {
    // Replace with real DB or backend logic
    Ok(vec![
        Todo {
            id: 1,
            title: "Learn Leptos".into(),
            completed: false,
        },
        Todo {
            id: 2,
            title: "Build SSR app".into(),
            completed: true,
        },
    ])
}

#[server(CreateTodo)]
pub async fn create_todo(title: String) -> Result<(), ServerFnError> {
    println!("Creating todo: {title}");
    Ok(())
}

#[server(ToggleTodo)]
pub async fn toggle_todo(id: u32) -> Result<(), ServerFnError> {
    println!("Toggling todo {id}");
    Ok(())
}

#[server(DeleteTodo)]
pub async fn delete_todo(id: u32) -> Result<(), ServerFnError> {
    println!("Deleting todo {id}");
    Ok(())
}
