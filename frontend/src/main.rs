use leptos::*;
use serde::{Deserialize, Serialize};
use gloo_net::http::Request;

#[derive(Clone, Serialize, Deserialize)]
struct Todo {
    id: u32,
    title: String,
}

#[component]
fn App() -> impl IntoView {
    let todos = create_resource(
        || (),
        |_| async {
            Request::get("http://localhost:3000/todos")
                .send()
                .await
                .unwrap()
                .json::<Vec<Todo>>()
                .await
                .unwrap()
        },
    );

    view! {
        <main style="font-family: sans-serif; padding: 2rem;">
            <h1>"🦀 Rust WASM Todo"</h1>

            <Suspense fallback=|| view! { <p>"Loading..."</p> }>
                {move || {
                    todos.get().map(|list| {
                        view! {
                            <ul>
                                {list.into_iter().map(|todo| view! {
                                    <li>{todo.title}</li>
                                }).collect_view()}
                            </ul>
                        }
                    })
                }}
            </Suspense>
        </main>
    }
}

fn main() {
    mount_to_body(|| view! { <App /> })
}
