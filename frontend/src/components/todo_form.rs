use crate::server::create_todo;
use leptos::*;

#[component]
pub fn TodoForm(on_created: Callback<()>) -> impl IntoView {
    let (title, set_title) = create_signal(String::new());

    let create = create_action(|title: &String| {
        let title = title.clone();
        async move { create_todo(title).await }
    });

    create_effect(move |_| {
        if let Some(Ok(())) = create.value().get() {
            set_title.set(String::new());
            on_created.call(());
        }
    });

    view! {
        <form
            on:submit=move |ev| {
                ev.prevent_default();
                let t = title.get();
                if !t.trim().is_empty() {
                    create.dispatch(t);
                }
            }
        >
            <input
                placeholder="Add a todo"
                prop:value=title
                on:input=move |e| set_title.set(event_target_value(&e))
            />
            <button type="submit" disabled=move || create.pending().get()>
                "Add"
            </button>
        </form>
    }
}
