package main

import (
	"flag"
	"github.com/webview/webview"
	"go-codeditor/internal"
)

func main() {

	headless := flag.Bool("headless", false, "Run the editor headless to use with an alternative front-end")
	flag.Parse()

	if *headless {
		internal.StartBackend()
	} else {
		go internal.StartBackend()

		wv := webview.New(false)
		defer wv.Destroy()

		wv.SetTitle("Go codeditor")
		wv.SetSize(1000, 680, webview.HintNone)
		wv.Navigate("http://localhost:30301")
		wv.Run()
	}
}
