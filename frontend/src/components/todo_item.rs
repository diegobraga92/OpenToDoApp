use crate::models::Todo;
use leptos::*;

#[component]
pub fn TodoItem(todo: Todo, on_toggle: Callback<u32>, on_delete: Callback<u32>) -> impl IntoView {
    let id = todo.id;

    view! {
        <li>
            <label>
                <input
                    type="checkbox"
                    checked=todo.completed
                    on:change=move |_| on_toggle.call(id)
                />
                <span
                    style=move || if todo.completed {
                        "text-decoration: line-through"
                    } else {
                        ""
                    }
                >
                    {todo.title}
                </span>
            </label>

            <button on:click=move |_| on_delete.call(id)>
                "✕"
            </button>
        </li>
    }
}
