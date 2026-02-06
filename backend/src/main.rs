mod routes;
mod models;
mod state;

use axum::Router;
use tower_http::cors::{Any, CorsLayer};
use tokio::net::TcpListener;
use std::net::SocketAddr;

use state::app_state::AppState;

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let state = AppState::new();

    let app = Router::new()
        .merge(routes::router(state))
        .layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = TcpListener::bind(addr).await.unwrap();

    println!("Backend running on http://{}", addr);

    axum::serve(listener, app).await.unwrap();
}
