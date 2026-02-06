use super::todo_item::TodoItem;
use crate::{
    models::Todo,
    server::{delete_todo, get_todos, toggle_todo},
};
use leptos::*;

#[component]
pub fn TodoList(#[prop(into)] refresh: ReadSignal<()>) -> impl IntoView {
    let todos = create_resource(move || refresh.get(), |_| get_todos());

    let toggle = create_action(|id: &u32| {
        let id = *id;
        async move { toggle_todo(id).await }
    });

    let delete = create_action(|id: &u32| {
        let id = *id;
        async move { delete_todo(id).await }
    });

    create_effect(move |_| {
        toggle.value().get();
        delete.value().get();
        todos.refetch();
    });

    let on_toggle = Callback::new(move |id| toggle.dispatch(id));
    let on_delete = Callback::new(move |id| delete.dispatch(id));

    view! {
        <Suspense fallback=|| view! { <p>"Loading..."</p> }>
            {move || -> View {
                match todos.get() {
                    None => view! {}.into_view(),

                    Some(Err(err)) => view! {
                        <p class="error">{err.to_string()}</p>
                    }.into_view(),

                    Some(Ok(list)) if list.is_empty() => view! {
                        <p>"No todos yet"</p>
                    }.into_view(),

                    Some(Ok(list)) => view! {
                        <ul>
                            {list.into_iter().map(|todo| view! {
                                <TodoItem
                                    todo=todo
                                    on_toggle=on_toggle
                                    on_delete=on_delete
                                />
                            }).collect_view()}
                        </ul>
                    }.into_view(),
                }
            }}
        </Suspense>
    }
}
