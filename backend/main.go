package main

/*
#cgo LDFLAGS: -lrust_core
#include <stdlib.h>

// declare functions from Rust
extern char* process_tasks(const char* input);
extern void free_string(char* s);
*/
import "C"
import (
	"encoding/json"
	"fmt"
	"net/http"
	"unsafe"
)

type Task struct {
	ID    string `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
}

type TaskList struct {
	Tasks []Task `json:"tasks"`
}

func callRustProcess(input TaskList) (TaskList, error) {
	inb, err := json.Marshal(input)
	if err != nil {
		return TaskList{}, err
	}
	cs := C.CString(string(inb))
	defer C.free(unsafe.Pointer(cs))

	// call rust
	out := C.process_tasks(cs)
	if out == nil {
		return TaskList{}, fmt.Errorf("rust call failed")
	}
	// remember to free the returned string
	defer C.free(unsafe.Pointer(out))
	// convert C string back to Go string
	goStr := C.GoString(out)

	var res TaskList
	if err := json.Unmarshal([]byte(goStr), &res); err != nil {
		return TaskList{}, err
	}
	return res, nil
}

func processHandler(w http.ResponseWriter, r *http.Request) {
	// (If not using middleware) add CORS headers here too — but middleware is cleaner.
	// If you used middleware above, you can remove the headers here.

	var tl TaskList
	if err := json.NewDecoder(r.Body).Decode(&tl); err != nil {
		http.Error(w, "bad json", http.StatusBadRequest)
		return
	}
	res, err := callRustProcess(tl)
	if err != nil {
		http.Error(w, "rust error: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// DEV: allow local dev origin. For more security, replace "*" with "http://localhost:5173"
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Credentials", "true") // optional

		// Handle preflight
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/process", processHandler)

	// wrap with CORS middleware
	handler := corsMiddleware(mux)

	fmt.Println("listening on :8080")
	http.ListenAndServe(":8080", handler)
}
