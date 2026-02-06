use crate::models::task::Task;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct AppState {
    pub todos: Arc<Mutex<Vec<Task>>>,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            todos: Arc::new(Mutex::new(Vec::new())),
        }
    }
}
