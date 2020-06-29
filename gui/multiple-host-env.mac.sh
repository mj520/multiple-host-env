go generate
GOOS=darwin GOARCH=amd64 go build -ldflags="-H windowsgui" -o ../multiple-host-env-gui.app
upx -9 upx --brute -9 ../multiple-host-env-gui.app