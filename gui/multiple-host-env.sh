go generate
GOOS=linux GOARCH=amd64 go build -ldflags="-H windowsgui" -o ../multiple-host-env-gui
upx -9 upx --brute -9 ../multiple-host-env-gui