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
