use axum::{
    extract::{Query, State},
    routing::{get, post},
    Json, Router,
};
use serde::Deserialize;
use sqlx::SqlitePool;
use std::sync::Arc;

use crate::application::sync::{get_events_since, insert_event};
use crate::domain::event::Event;

#[derive(Clone)]
pub struct AppState {
    pub pool: SqlitePool,
}

#[derive(Deserialize)]
pub struct SinceQuery {
    since: i64,
}

pub fn create_router(state: AppState) -> Router {
    Router::new()
        .route("/events", post(post_event))
        .route("/events", get(get_events))
        .with_state(Arc::new(state))
}

async fn post_event(State(state): State<Arc<AppState>>, Json(event): Json<Event>) {
    insert_event(&state.pool, &event).await;
}

async fn get_events(
    State(state): State<Arc<AppState>>,
    Query(query): Query<SinceQuery>,
) -> Json<Vec<Event>> {
    let events = get_events_since(&state.pool, query.since).await;
    Json(events)
}
