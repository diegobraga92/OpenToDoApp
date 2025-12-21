use serde::{Deserialize, Serialize};
use std::ffi::{CStr, CString};
use std::os::raw::c_char;

enum ActionType {
    Create,
    Update,
    Delete,
    Archive,
}

#[derive(Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub done: bool,
    pub time: f64,
}

#[derive(Serialize, Deserialize)]
pub struct TaskList {
    pub tasks: Vec<Task>,
}

// Simple function: input JSON string with {"tasks":[...]} -> returns JSON with new state.
// We export C functions that take/return C strings (char *) — Go will pass C strings.
#[unsafe(no_mangle)]
pub extern "C" fn process_tasks(input: *const c_char) -> *mut c_char {
    // Safety: expect a null-terminated C string
    let c_str = unsafe {
        if input.is_null() {
            return std::ptr::null_mut();
        }
        CStr::from_ptr(input)
    };

    let s = match c_str.to_str() {
        Ok(s) => s,
        Err(_) => return std::ptr::null_mut(),
    };

    // Parse input JSON
    let mut list: TaskList = match serde_json::from_str(s) {
        Ok(l) => l,
        Err(_) => return std::ptr::null_mut(),
    };

    // Example core logic: toggle all tasks' done state to false (example)
    for t in &mut list.tasks {
        t.done = false;
    }

    let out_str = match serde_json::to_string(&list) {
        Ok(s) => s,
        Err(_) => return std::ptr::null_mut(),
    };

    // Return newly allocated C string. Caller (Go) should free it via free_string below.
    let c_out = CString::new(out_str).unwrap();
    c_out.into_raw()
}

#[unsafe(no_mangle)]
pub extern "C" fn free_string(s: *mut c_char) {
    if s.is_null() { return; }
    unsafe {
        CString::from_raw(s); // drops and frees
    }
}
