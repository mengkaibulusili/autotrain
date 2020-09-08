import os

input_name = "input.csv"

train_data_name = "train_data.csv"
train_label_name = "train_label.csv"

test_data_name = "test_data.csv"
test_label_name = "test_label.csv"


def getShapeAndTypeCount(dir_path):
    input_path = os.path.join(dir_path,input_name)

    train_data_path = os.path.join(dir_path,train_data_name)
    train_label_path = os.path.join(dir_path,train_label_name)

    test_data_path = os.path.join(dir_path,test_data_name)
    test_label_path = os.path.join(dir_path,test_label_name)

    train_data_f = open( train_data_path )
    train_label_f = open( train_label_path )
    test_data_f = open( test_data_path )
    test_label_f = open( test_label_path )
    line_count = 0

    # 数据 的 维度 
    data_shape = 0
    # 数据 的 总分类
    type_count = 0

    with open(input_path) as f:
        for line in f:
            line[-1] = "" if line[-1] == "," else line[-1]
            params = line.split(",")
            label_s = params[0:1]
            type_count = max( type_count, int(label_s[0]) )
            data_s  = params[1:]
            data_shape = len(data_s)
            split_sign = ","
            data_str = split_sign.join(data_s)
            label_str = split_sign.join(label_s)
            if int(line_count) % 4 != 0:
                train_data_f.write(data_str)
                train_data_f.write("\n")
                train_label_f.write(label_str)
            else:
                test_data_f.write(data_str)
                test_data_f.write("\n")
                test_label_f.write(label_str)
            line_count += 1
    return data_shape , type_count

            
