package internal

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func StartBackend() {
	mux := http.NewServeMux()

	mux.Handle("/", http.FileServer(http.Dir("./web")))
	mux.HandleFunc("/save", EnforceMethod("POST", saveFile))
	mux.HandleFunc("/ls", EnforceMethod("GET", ls))
	mux.HandleFunc("/open", EnforceMethod("GET", openFile))

	err := http.ListenAndServe(":30301", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.Method, r.URL.String())
		mux.ServeHTTP(w, r)
	}))
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

	log.Println("ERR:", message)

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
	recurse := r.URL.Query()["recurse"]

	if len(dir) == 0 {
		errorResponse(w, "Must use dir query", RequestMissingQuery, 400)
		return
	}

	var err error
	dirString := dir[0]

	// Default directory will be user's home dir
	if dirString == "~" {
		dirString, err = os.UserHomeDir()
		if err != nil {
			errorResponse(w, err.Error(), InternalErrorFatal, 500)
			return
		}
	}

	stat, err := os.Stat(dirString)
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

	list.Dir = dirString
	if len(recurse) > 0 {
		if err := filepath.WalkDir(dirString, func(path string, info os.DirEntry, err error) error {
			if err != nil {
				return err
			}

			if path != dirString {
				list.Entries = append(list.Entries, FileEntry{
					Name:  path,
					IsDir: info.IsDir(),
				})
			}

			return nil
		}); err != nil {
			errorResponse(w, "Could not list files: "+err.Error(), InternalErrorNonFatal, 500)
			return
		}
	} else {
		fileinfo, err := ioutil.ReadDir(dirString)
		if err != nil {
			errorResponse(w, err.Error(), InternalErrorFatal, 500)
			return
		}

		for _, f := range fileinfo {
			list.Entries = append(list.Entries, FileEntry{
				Name:  filepath.Join(dirString, f.Name()),
				IsDir: f.IsDir(),
			})
		}
	}

	// Ensure list.Dir ends with a /
	if list.Dir[len(list.Dir)-1] != '/' {
		list.Dir = list.Dir + "/"
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
	body := &struct {
		Text string `json:"text"`
	}{}

	if len(f) == 0 {
		errorResponse(w, "Must use f query parameter", RequestMissingQuery, 400)
		return
	}

	b, err := ioutil.ReadFile(f[0])
	if err != nil {
		errorResponse(w, "Could not read file", InternalErrorFatal, 500)
		return
	}

	body.Text = string(b)
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
