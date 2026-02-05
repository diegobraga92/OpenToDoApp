use axum::{routing::get, Json, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

#[derive(Serialize, Deserialize)]
struct Todo {
    id: u32,
    title: String,
}

async fn health() -> &'static str {
    "OK"
}

async fn list_todos() -> Json<Vec<Todo>> {
    Json(vec![
        Todo {
            id: 1,
            title: "Learn Rust".into(),
        },
        Todo {
            id: 2,
            title: "Build WASM app".into(),
        },
    ])
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/health", get(health))
        .route("/todos", get(list_todos))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Backend running on http://{}", addr);

    let listener = TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
