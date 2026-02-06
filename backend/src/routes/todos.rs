use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, put},
    Json, Router,
};
use uuid::Uuid;

use crate::{
    models::task::Task,
    state::app_state::AppState,
};

#[derive(serde::Deserialize)]
pub struct CreateTodo {
    pub text: String,
}

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/todos", get(get_todos).post(create_todo))
        .route("/todos/:id", put(toggle_todo).delete(delete_todo))
        .with_state(state)
}

async fn get_todos(State(state): State<AppState>) -> Json<Vec<Task>> {
    let todos = state.todos.lock().unwrap();
    Json(todos.clone())
}

async fn create_todo(
    State(state): State<AppState>,
    Json(payload): Json<CreateTodo>,
) -> (StatusCode, Json<Task>) {
    let mut todos = state.todos.lock().unwrap();

    let todo = Task {
        id: Uuid::new_v4(),
        text: payload.text,
        done: false,
    };

    todos.push(todo.clone());

    (StatusCode::CREATED, Json(todo))
}

async fn toggle_todo(
    Path(id): Path<Uuid>,
    State(state): State<AppState>,
) -> Result<Json<Task>, StatusCode> {
    let mut todos = state.todos.lock().unwrap();

    let todo = todos
        .iter_mut()
        .find(|t| t.id == id)
        .ok_or(StatusCode::NOT_FOUND)?;

    todo.done = !todo.done;

    Ok(Json(todo.clone()))
}

async fn delete_todo(
    Path(id): Path<Uuid>,
    State(state): State<AppState>,
) -> StatusCode {
    let mut todos = state.todos.lock().unwrap();
    let len_before = todos.len();

    todos.retain(|t| t.id != id);

    if todos.len() == len_before {
        StatusCode::NOT_FOUND
    } else {
        StatusCode::NO_CONTENT
    }
}
