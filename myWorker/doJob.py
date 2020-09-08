import json
import requests
import os
import tensorflow as tf
from tensorflow import keras
import dealCsv
import numpy

proxy = "http://localhost:8000"
def getJobFromQuene():
    jobapi = "/api/trainModel/getJob/"
    url=proxy+jobapi
    r = requests.get(url)
    return  json.loads(r.content.decode("utf8"))
#  {"code": "0", "message": "", "data": {"modelname": "assaasasasa", "csvsize": "0 B", "csvname": "asas.csv", "modelstructure": "[{\"index\":0,\"type\":\"Flatten\",\"inputShape\":\"auto\"},{\"index\":1,\"type\":\"Dense\",\"size\":\"100\",\"activation\":\"relu\"},{\"index\":2,\"type\":\"Dense\",\"size\":\"auto\",\"activation\":\"relu\"}]", "jobuuid": "69f06fd2f10c11eaba1b1cb72c0cb1bd", "savedir": "D:\\ProgWare\\lmk\\autotrain\\myServer\\storeFiles\\69f06fd2f10c11eaba1b1cb72c0cb1bd"}}

def getJobTest():
    s1 = r'{"code": "0", "message": "", "data": {"modelname": "model1", "csvsize": "205 B", "csvname": "test.csv", "modelstructure": "[{\"index\":0,\"type\":\"Flatten\",\"inputShape\":\"auto\"},{\"index\":1,\"type\":\"Dense\",\"size\":\"100\",\"activation\":\"relu\"},{\"index\":2,\"type\":\"Dense\",\"size\":\"123\",\"activation\":\"sigmoid\"},{\"index\":3,\"type\":\"Dense\",\"size\":\"auto\",\"activation\":\"relu\"}]", "jobuuid": "40aab9baf1ca11eab0f11cb72c0cb1bd", "savedir": "D:\\ProgWare\\lmk\\autotrain\\myServer\\storeFiles\\40aab9baf1ca11eab0f11cb72c0cb1bd"}}'
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
        model_structure = json.loads(model_structure)
        return job_dir,model_name,model_structure
    else:
        raise Exception("状态码 错误,没有可执行任务")

def getNpListFromStrList(l_str):
    return numpy.asarray( [ float(x) for x in l_str ] )

def getNpListFrom2DStrList(l_str):
    return numpy.asarray( [ [ float(y) for y in x ]   for x in l_str ] )


# selu 以及alphadroupout
# selu 自带参数批归一化
# 一层相当于两层

# model.add(Dense(nodelist[layerindex%len(nodelist)],activation='relu'))
# model.add(BatchNormalization())
def pruductModel():
    job_dir,model_name,model_structure = dealJobContent()

    # 根据输入文件 划分训练集 测试集 以及 模型输入类型 和 类别 总数
    data_shape , type_count ,train_data , train_label ,test_data , test_label   = dealCsv.getShapeAndTypeCountAndData(job_dir)

    train_data = getNpListFrom2DStrList(train_data)
    train_label = getNpListFrom2DStrList(train_label)

    test_data = getNpListFrom2DStrList(test_data)
    test_label = getNpListFrom2DStrList(test_label)

    # {'code': '0', 'message': '', 'data': {'modelname': 'assaasasasa', 'csvsize': '0 B', 'csvname': 'asas.csv', 'modelstructure': '[{"index":0,"type":"Flatten","inputShape":"auto"},{"index":1,"type":"Dense","size":"100","activation":"relu"},{"index":2,"type":"Dense","size":"auto","activation":"relu"}]', 'jobuuid': '69f06fd2f10c11eaba1b1cb72c0cb1bd', 'savedir': 'D:\\ProgWare\\lmk\\autotrain\\myServer\\storeFiles\\69f06fd2f10c11eaba1b1cb72c0cb1bd'}}
    model =  keras.Sequential([keras.layers.Flatten(input_shape=( int(data_shape), ))])

    # 去除 模型输入层 和 模型输出层
    model_structure = model_structure[1:-1]

    for item in model_structure:
        print(item)
        if item["type"] == "Dense":
            model.add(keras.layers.Dense(int(item["size"]) ,activation=item["activation"]  ))
    
    model.add(keras.layers.Dense(int(type_count)))

    early_stop_callback = tf.keras.callbacks.EarlyStopping(
        monitor='loss', min_delta=1e-2, patience=10
    )
    # early_stop_callback = tf.keras.callbacks.EarlyStopping(
    #     monitor='loss',  patience=10
    # )

    # checkpoint_callback = tf.keras.callbacks.ModelCheckpoint(
    #     filepath, monitor='val_loss', verbose=0, save_best_only=False,
    #     save_weights_only=False, mode='auto', save_freq='epoch', options=None, **kwargs
    # )

    model.compile(optimizer='adam',
                loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
                metrics=['accuracy']
              )

    model.fit(train_data, train_label,epochs=100000,callbacks=[early_stop_callback,])

    test_loss, test_acc = model.evaluate(test_data,  test_label, verbose=2)

    model.add(tf.keras.layers.Softmax())

    print('\nTest accuracy:', test_acc)

    model_path = os.path.join(job_dir,model_name)
    model.save(model_path)

    model.summary()



if __name__ == "__main__":
    pruductModel()