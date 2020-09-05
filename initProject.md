# 初始化client 
npm install  create-react-app -g
npx create-react-app  myapp --typescript


# 初始化 server
django-admin startproject myServer
cd myServer
python .\manage.py startapp trainModel

# 收集python 依赖
pip install pipreqs
pipreqs ./
