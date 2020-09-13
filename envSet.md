# pip 设置 华为镜像

pip config --global set global.index-url https://repo.huaweicloud.com/repository/pypi/simple

pip config --global set install.trusted-host repo.huaweicloud.com

# npm 设置镜像

npm config set registry https://repo.huaweicloud.com/repository/npm/
npm cache clean -f

npm config set disturl https://repo.huaweicloud.com/nodejs

npm config set sass_binary_site https://repo.huaweicloud.com/node-sass

npm config set phantomjs_cdnurl https://repo.huaweicloud.com/phantomjs
npm config set chromedriver_cdnurl https://repo.huaweicloud.com/chromedriver
npm config set operadriver_cdnurl https://repo.huaweicloud.com/operadriver

npm config set electron_mirror https://repo.huaweicloud.com/electron/
npm config set python_mirror https://repo.huaweicloud.com/python

# 先配置好 docker 环境,并且预准备 board 镜像

docker pull tensorflow/tensorflow:nightly-py3-jupyter

打开防火墙 6006 端口
