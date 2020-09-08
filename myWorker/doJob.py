import json
import requests
import os
import tensorflow as tf
from tensorflow import keras

proxy = "http://localhost:8000"
def getJobFromQuene():
    jobapi = "/api/trainModel/getJob/"
    url=proxy+jobapi
    r = requests.get(url)
    return  json.loads(r.content.decode("utf8"))
#  {"code": "0", "message": "", "data": {"modelname": "assaasasasa", "csvsize": "0 B", "csvname": "asas.csv", "modelstructure": "[{\"index\":0,\"type\":\"Flatten\",\"inputShape\":\"auto\"},{\"index\":1,\"type\":\"Dense\",\"size\":\"100\",\"activation\":\"relu\"},{\"index\":2,\"type\":\"Dense\",\"size\":\"auto\",\"activation\":\"relu\"}]", "jobuuid": "69f06fd2f10c11eaba1b1cb72c0cb1bd", "savedir": "D:\\ProgWare\\lmk\\autotrain\\myServer\\storeFiles\\69f06fd2f10c11eaba1b1cb72c0cb1bd"}}

def getJobTest():
    s1 = r'{"code": "0", "message": "", "data": {"modelname": "assaasasasa", "csvsize": "0 B", "csvname": "asas.csv", "modelstructure": "[{\"index\":0,\"type\":\"Flatten\",\"inputShape\":\"auto\"},{\"index\":1,\"type\":\"Dense\",\"size\":\"100\",\"activation\":\"relu\"},{\"index\":2,\"type\":\"Dense\",\"size\":\"auto\",\"activation\":\"relu\"}]", "jobuuid": "69f06fd2f10c11eaba1b1cb72c0cb1bd", "savedir": "D:\\ProgWare\\lmk\\autotrain\\myServer\\storeFiles\\69f06fd2f10c11eaba1b1cb72c0cb1bd"}}'
    return json.loads(s1)




# {'code': '0', 'message': '', 'data': {'modelname': 'assaasasasa', 'csvsize': '0 B', 'csvname': 'asas.csv', 'modelstructure': '[{"index":0,"type":"Flatten","inputShape":"auto"},{"index":1,"type":"Dense","size":"100","activation":"relu"},{"index":2,"type":"Dense","size":"auto","activation":"relu"}]', 'jobuuid': '69f06fd2f10c11eaba1b1cb72c0cb1bd', 'savedir': 'D:\\ProgWare\\lmk\\autotrain\\myServer\\storeFiles\\69f06fd2f10c11eaba1b1cb72c0cb1bd'}}
def dealJobContent():
    # content =  getJobFromQuene()
    content = getJobTest()
    if content["code"] == "0":
        job_dir =  content["data"]["savedir"]
        model_name = content["data"]["modelname"]
        model_name = "{}.h5".format(model_name)
        model_structure =  content["data"]["modelstructure"]
        return job_dir,model_name,model_structure
    else:
        raise Exception("状态码 错误,没有可执行任务")

def pruductModel():
    job_dir,model_name,model_structure = dealJobContent()
    model = keras.Sequential([
    keras.layers.Flatten(input_shape=(28, 28)),
    keras.layers.Dense(128, activation='relu')
])
    model.add(keras.layers.Dense(10))

    model.compile(optimizer='adam',
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])
    model_path = os.path.join(job_dir,model_name)
    model.save(model_path)



if __name__ == "__main__":
    pruductModel()