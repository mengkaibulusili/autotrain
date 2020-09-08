import os

input_name = "input.csv"

train_data_name = "train_data.csv"
train_label_name = "train_label.csv"

test_data_name = "test_data.csv"
test_label_name = "test_label.csv"


def getShapeAndTypeCountAndData(dir_path):
    input_path = os.path.join(dir_path,input_name)

    train_data_path = os.path.join(dir_path,train_data_name)
    train_label_path = os.path.join(dir_path,train_label_name)

    test_data_path = os.path.join(dir_path,test_data_name)
    test_label_path = os.path.join(dir_path,test_label_name)

    train_data_f = open( train_data_path ,mode="w" )
    train_label_f = open( train_label_path ,mode="w")
    test_data_f = open( test_data_path ,mode="w")
    test_label_f = open( test_label_path ,mode="w")
    line_count = 0

    train_data = []
    train_label = []

    test_data = []
    test_label = []

    # 数据 的 维度 
    data_shape = 0
    # 数据 的 总分类
    type_count = 0

    with open(input_path) as f:
        for line in f:
            line = line[:-1] if line[-1] == "," else line

            params = line.strip().split(",")
            if len(params) < 3:
                break
            label_list = params[0:1]
            type_count = max( type_count, int(label_list[0]) )
            data_list  = params[1:]
            
            # 令之后的数据行 和 第一行 对齐
            #  长 切 短 补
            if line_count == 0 :
                data_shape = len(data_list)
            if len(data_list) > data_shape:
                data_list = data_list[:data_shape]
            elif len(data_list) < data_shape:
                diff_line = data_shape - len(data_list)
                data_list = data_list + [ 0  for i in range(diff_line) ]
            
            split_sign = ","
            data_str = split_sign.join(data_list)
            data_str = data_str+"\n"
            label_str = split_sign.join(label_list)
            label_str = label_str+","
            if int(line_count) % 4 != 0:
                train_data_f.write(data_str)
                train_label_f.write(label_str)
                
                train_data.append( data_list )
                train_label.append( label_list )

            else:
                test_data_f.write(data_str)
                test_label_f.write(label_str)

                test_data.append( data_list )
                test_label.append( label_list )

            line_count += 1

    train_data_f.close()
    train_label_f.close()
    test_data_f.close()
    test_label_f.close()
    

    # 类别 有可能从 0 开始算， 所以 + 1
    return [ data_shape ,
             type_count+1 ,
             train_data ,
             train_label ,
             test_data ,
             test_label  ]

            
