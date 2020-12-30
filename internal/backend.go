package internal

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
)

func StartBackend() {
	mux := http.NewServeMux()

	mux.Handle("/", http.FileServer(http.Dir("./web")))
	mux.HandleFunc("/save", EnforceMethod("POST", saveFile))
	mux.HandleFunc("/ls", EnforceMethod("GET", ls))
	mux.HandleFunc("/open", EnforceMethod("GET", openFile))

	err := http.ListenAndServe(":30301", mux)
	if err != nil {
		panic(err)
	}
}

// Writes an error response that the editor can understand
func errorResponse(w http.ResponseWriter, message string, reason ErrorReason, status int) {
	errBody := &struct {
		error  ErrorReason
		reason string
	}{reason, message}

	b, err := json.Marshal(errBody)
	if err != nil {
		http.Error(w, message, status)
		return
	}

	w.WriteHeader(status)
	_, _ = w.Write(b)
}

func EnforceMethod(method string, next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// All responses are json
		w.Header().Set("Content-Type", "application/json")
		if r.Method != method {
			errorResponse(w, "Method not supported", BadMethod, 400)
			return
		}
		next(w, r)
	}
}

type ErrorReason int

const (
	// Errors
	RequestMissingQuery   ErrorReason = 0
	InternalErrorNonFatal ErrorReason = 1
	InternalErrorFatal    ErrorReason = 2
	BadMethod             ErrorReason = 3
)

type FileEntry struct {
	Name  string `json:"name"`
	IsDir bool   `json:"isDir"`
}

type FileList struct {
	Dir     string      `json:"dir"`
	Entries []FileEntry `json:"entries"`
}

// List all files in a directory
func ls(w http.ResponseWriter, r *http.Request) {
	list := &FileList{}
	dir := r.URL.Query()["dir"]

	if len(dir) == 0 {
		errorResponse(w, "Must use dir query", RequestMissingQuery, 400)
		return
	}

	stat, err := os.Stat(dir[0])
	if err != nil {
		if os.IsNotExist(err) {
			errorResponse(w, "Directory does not exist", InternalErrorNonFatal, 404)
			return
		}
	}

	if !stat.IsDir() {
		errorResponse(w, "Specified path is not a directory", InternalErrorNonFatal, 400)
		return
	}

	list.Dir = dir[0]

	ls, err := ioutil.ReadDir(dir[0])
	if err != nil {
		errorResponse(w, "Could not list files: "+err.Error(), InternalErrorNonFatal, 500)
		return
	}

	for _, f := range ls {
		list.Entries = append(list.Entries, FileEntry{
			Name:  f.Name(),
			IsDir: f.IsDir(),
		})
	}

	b, err := json.Marshal(list)
	if err != nil {
		errorResponse(w, "Could not write response", InternalErrorFatal, 500)
		return
	}

	_, _ = w.Write(b)
}

// Opens a file and returns its contents for the editor to display
func openFile(w http.ResponseWriter, r *http.Request) {
	f := r.URL.Query()["f"]
	body := &struct{ text string }{}

	if len(f) == 0 {
		errorResponse(w, "Must use f query parameter", RequestMissingQuery, 400)
		return
	}

	b, err := ioutil.ReadFile(f[0])
	if err != nil {
		errorResponse(w, "Could not read file", InternalErrorFatal, 500)
		return
	}

	body.text = string(b)
	bodyBytes, err := json.Marshal(body)
	if err != nil {
		errorResponse(w, "Could not write response", InternalErrorFatal, 500)
		return
	}

	_, _ = w.Write(bodyBytes)
}

// Writes the changes to a file back to that file
func saveFile(w http.ResponseWriter, r *http.Request) {
	f := r.URL.Query()["f"]

	if len(f) == 0 {
		errorResponse(w, "Must use f query parameter", RequestMissingQuery, 400)
		return
	}

	// Copy bytes from body to the file
	fd, err := os.OpenFile(f[0], os.O_CREATE|os.O_RDWR, 0644)
	if err != nil {
		errorResponse(w, "Can't open file", InternalErrorFatal, 500)
		return
	}

	b, err := ioutil.ReadAll(r.Body)
	if err != nil {
		errorResponse(w, "Could not read response body", InternalErrorFatal, 500)
		return
	}

	if _, err = fd.Write(b); err != nil {
		errorResponse(w, "Could not write to file", InternalErrorFatal, 500)
		return
	}

	w.WriteHeader(200)
}
