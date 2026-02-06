use leptos::*;
mod app;
mod components;
mod models;
mod server;

use app::App;

fn main() {
    mount_to_body(|| view! { <App /> })
}
