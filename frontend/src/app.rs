use crate::components::{todo_form::TodoForm, todo_list::TodoList};
use leptos::*;

#[component]
pub fn App() -> impl IntoView {
    let (refresh, set_refresh) = create_signal(());

    view! {
        <main style="font-family: sans-serif; padding: 2rem;">
            <h1>"🦀 Rust SSR Todo"</h1>

            <TodoForm on_created=Callback::new(move |_| {
                set_refresh.set(());
            }) />

            <TodoList refresh=refresh />
        </main>
    }
}
