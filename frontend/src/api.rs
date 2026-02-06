// HTTP Calls
use crate::models::{NewTodo, Todo};
use gloo_net::http::Request;

pub async fn fetch_todos() -> Result<Vec<Todo>, String> {
    Request::get("/todos")
        .send()
        .await
        .map_err(|e| e.to_string())?
        .json::<Vec<Todo>>()
        .await
        .map_err(|e| e.to_string())
}

pub async fn create_todo(title: String) -> Result<(), String> {
    Request::post("/todos")
        .json(&NewTodo { title })
        .map_err(|e| e.to_string())?
        .send()
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub async fn toggle_todo(id: u32) -> Result<(), String> {
    Request::patch(&format!("/todos/{id}/toggle"))
        .send()
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}

pub async fn delete_todo(id: u32) -> Result<(), String> {
    Request::delete(&format!("/todos/{id}"))
        .send()
        .await
        .map_err(|e| e.to_string())?;
    Ok(())
}
