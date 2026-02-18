use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct List {
    pub id: Uuid,
    pub name: String,
}
