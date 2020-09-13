# 初始化 client

npm install create-react-app -g
npx create-react-app myapp --typescript

# 初始化 server

django-admin startproject myServer
cd myServer
python .\manage.py startapp trainModel

# 收集 python 依赖

pip install pipreqs
pipreqs ./

# 解决 django 提示问题

```bash
pip install pylint-django
```

添加配置 User Settings (Ctrl + , or File > Preferences > Settings

```json
"python.linting.pylintArgs": [
        "--load-plugins=pylint_django",
    ]
```

# 设置 python 缩进 2 空格

C:\Python38\Lib\site-packages\yapf\yapflib\style.py
修改 434 INDENT_WIDTH=2,

# 设置 git 帐号

git config --global user.email "734449600@qq.com"
git config --global user.name "lmk"

# vscode 配置文件

```
{
  "editor.wordWrap": "on",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,

  "python.formatting.provider": "yapf",
  "python.linting.pylintArgs": [
    "--load-plugins=pylint_django",
    "--disable=E1101",
    "--disable=W,C"
  ],

  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}

```

# 启动 tensorboard

刷新资源的时间
tensorboard --logdir C:\gitproj\autotrain\myTensorBoard\logs --reload_interval=1 --reload_multifile=true --reload_multifile_inactive_secs=1

# 从容器启动 tensorboard

docker run -it -p 6006:6006 tensorflow/tensorflow:nightly-py3-jupyter tensorboard

docker run -it -p 6006:6006 -v C:/gitproj/autotrain/myTensorBoard/logs:/root/logs --rm --name tsboard tensorflow/tensorflow:nightly-py3-jupyter "tensorboard" "--logdir" "/root/logs" "--bind_all"
