# 根据输入的 csv 文件 进行自动的深度学习模型生成

# 功能设计

1.上传csv
2.自动生成默认网络结构
3.开始训练
4.训练记录存储
5.tensorbroad 展示回调
6.训练结果查看与导出

# 开发工具
vscode

# client端设计
## 工具和语言
npm
ts
ant

## 组件设计
### 训练准备页面
#### 文件上传组件
上传csv 文件,一行一个数据

#### 网络模型展示组件
展示已用的网络层数，后期版本可以让用户修改


#### 提交训练任务组件
开始执行训练任务

### 查看训练任务页面
#### 展示训练任务表格
一行一个训练任务，可以跳转到某个训练任务的 页面，并查看训练任务的状态


### 集成 tensorbroad 监视训练任务页面



# server设计
## 工具和语言

python
django
sqlite3

# start server
```bash
.\py3_venv\Scripts\Activate.ps1
(py3_venv) pip install -r .\requirements.txt
(py3_venv) python ./Test/startTest.py
```
