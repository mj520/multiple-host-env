//go:generate goversioninfo -icon=../favicon.ico -manifest=.manifest -64

package main

import (
	"github.com/zserge/lorca"
	"io/ioutil"
	"log"
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
		pid, _ := strconv.Atoi(string(pidBt))
		p, err := os.FindProcess(pid)
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
	ui, err := lorca.New(
		"http://127.0.0.1:9394",
		"",
		800,
		600)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		node.Process.Kill()
		ui.Close()
	}()
	// Wait until UI window is closed
	<-ui.Done()
}
