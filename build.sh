#!/bin/bash
###
 # @Author: 李东轩 Dongxuan.Li@lotuscars.com.cn
 # @Date: 2023-12-14 18:45:02
 # @LastEditors: 李东轩
 # @LastEditTime: 2024-02-02 13:44:16
 # @Description: file content
### 
version=$(date +"%Y%m%d%H%M%S")
commitid=$(git rev-parse --short HEAD)
origin=history.stocks/web/server
pnpm build
docker build   -t  ${origin}:web-${version}-${commitid}  .

docker save ${origin}:web-${version}-${commitid}  -o  ./web.jar
