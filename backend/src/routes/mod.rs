use crate::state::app_state::AppState;
use axum::Router;

pub mod todos;

pub fn router(state: AppState) -> Router {
    Router::new().merge(todos::router(state))
}
