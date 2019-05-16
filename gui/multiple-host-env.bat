go build -ldflags="-H windowsgui -s -w" -o ../multiple-host-env-gui.exe multiple-host-env.go
upx -9 upx --brute -9 ../multiple-host-env-gui.exe