use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};

pub async fn init_db(database_url: &str) -> SqlitePool {
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(database_url)
        .await
        .expect("Failed to connect to DB");

    // Create tables if not exist
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            entity_id TEXT NOT NULL,
            entity_type TEXT NOT NULL,
            event_type TEXT NOT NULL,
            payload TEXT NOT NULL,
            timestamp INTEGER NOT NULL,
            device_id TEXT NOT NULL
        );
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS lists (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL
        );
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            list_id TEXT NOT NULL,
            title TEXT NOT NULL,
            task_type TEXT NOT NULL,
            deleted INTEGER NOT NULL
        );
        "#,
    )
    .execute(&pool)
    .await
    .unwrap();

    pool
}
