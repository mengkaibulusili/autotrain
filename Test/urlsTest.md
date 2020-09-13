# trainModel url 测试

http://localhost:8000/api/trainModel/success/
http://localhost:8000/api/trainModel/fail/
http://localhost:8000/api/trainModel/test1/

# 提交任务

http://localhost:8000/api/trainModel/putJob/?data={}

http://localhost:8000/api/trainModel/getJob/

http://localhost:8000/api/trainModel/getJobLen/

查看所有请求 包含 modelname 的
http://localhost:8000/api/trainModel/getAllJobInfo

# 改变 logs 位置

http://localhost:8000/api/trainModel/changeLogsPath/?data={"job_uuid":"641e88cdf57e11eaa9d58030491cc416"}

# 下载文档

http://localhost:8000/api/downloadFile/downloadByName/?data={"file_name":"small_mnist_train.csv"}
