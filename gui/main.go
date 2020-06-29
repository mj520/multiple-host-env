//go:generate goversioninfo -icon=../favicon.ico -manifest=.manifest -64

package main

import (
	"github.com/zserge/webview"
	"io/ioutil"
	"os"
	"os/exec"
	"os/signal"
	"strconv"
	"syscall"
)
var node *exec.Cmd
func main() {
	pidBt, err := ioutil.ReadFile("../multiple-host-env.pid")
	if err == nil {
		pid,_ := strconv.Atoi(string(pidBt))
		p,err:=os.FindProcess(pid)
		if err == nil {
			p.Kill()
		}
	}
	
	node = exec.Command("node", "main.js", "0")
	node.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	node.Start()
	//ioutil.WriteFile("multiple-host-env.pid",[]byte(string(node.Process.Pid)),os.ModeAppend)
	c := make(chan os.Signal)
	//监听指定信号 ctrl+c kill
	signal.Notify(c, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	go func() {
		for s := range c {
			switch s {
			case syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT:
				node.Process.Kill()
				os.Exit(0)
			}
		}
	}()
	w := webview.New(webview.Settings{
		Width:     800,
		Height:    600,
		Title:     "multiple-host-env",
		Resizable: true,
		URL:       "http://127.0.0.1:9394",
	})
	w.SetColor(255, 255, 255, 255)
	defer node.Process.Kill();w.Exit()
	w.Run()
}