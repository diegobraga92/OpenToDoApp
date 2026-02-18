use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    pub id: Uuid,
    pub list_id: Uuid,
    pub title: String,
    pub task_type: String, // "regular" | "daily"
    pub deleted: bool,
}
