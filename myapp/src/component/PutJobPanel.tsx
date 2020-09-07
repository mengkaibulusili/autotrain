import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Upload,
  Input,
  Button,
  message,
  Modal,
  Divider,
  Select,
  Tag,
} from "antd";
import { AnyCnameRecord } from "dns";
import { InboxOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import * as _ from "lodash";
import { putJobApi } from "../net/netJob";
import prettyBytes from "pretty-bytes";

import { Dense, Flatten } from "../modelLayer/Layers";
import { ModelLayersView } from "../modelLayer/LayersButton";
import ReactJson from "react-json-view";

const { Dragger } = Upload;
const { Option } = Select;

// File {uid: "rc-upload-1599299523945-2", name: "新建文本文档.txt", lastModified: 1598709911529, lastModifiedDate: Sat Aug 29 2020 22:05:11 GMT+0800 (中国标准时间), webkitRelativePath: "", …}
// lastModified: 1598709911529
// lastModifiedDate: Sat Aug 29 2020 22:05:11 GMT+0800 (中国标准时间) {}
// name: "新建文本文档.txt"
// size: 218
// type: "text/plain"
// uid: "rc-upload-1599299523945-2"
// webkitRelativePath: ""
// __proto__: File

export let PutJobPanel = () => {
  let [fN, setFN] = useState("未提交");
  let [modelN, setModelN] = useState("");
  let [fSize, setFSize] = useState(0);
  let [file, setFile] = useState("");

  let f1: Flatten = { index: 0, type: "Flatten", inputShape: "auto" };
  let d1: Dense = { index: 1, type: "Dense", size: "100", activation: "relu" };
  let d2: Dense = { index: 2, type: "Dense", size: "auto", activation: "relu" };
  let modelStructure_: any = [f1, d1, d2];
  let [modelStructure, setModelStructure] = useState(modelStructure_);

  let formData = new FormData();

  let [modelViews, setModelViews] = useState(<Row></Row>);

  // 临时添加层的数据

  useEffect(() => {
    setModelViews(
      ModelLayersView(modelStructure, (index: number) => {
        let model = Modal.info({
          title: "修改模型",
          content: <Row></Row>,
          okText: "取消",
          width: "600px",
        });

        let content1 = (
          <Row>
            <Button
              type="dashed"
              onClick={() => {
                if (_.isEqual(index, 0)) {
                  message.info({
                    content: <p>不可以删除输入层</p>,
                    duration: 3,
                  });
                } else if (_.isEqual(index, modelStructure.length - 1)) {
                  message.info({
                    content: <p>不可以删除 分类输出层</p>,
                    duration: 3,
                  });
                } else {
                  let layers = modelStructure;
                  layers.splice(index, 1);
                  setModelStructure(layers.slice());
                }
                Modal.destroyAll();
              }}
            >
              删除该层
            </Button>
            <Divider type="vertical"></Divider>
            <Button
              type="primary"
              onClick={() => {
                if (_.isEqual(index, modelStructure.length - 1)) {
                  message.info({
                    content: <p>分类输出层 末尾不可添加</p>,
                    duration: 3,
                  });
                  Modal.destroyAll();
                  return;
                }
                model.update({
                  content: content2,
                });
              }}
            >
              向下新增
            </Button>
          </Row>
        );

        let content2 = (
          <Row>
            <Col>{content1}</Col>
            <Divider type="horizontal"></Divider>
            <Col>
              <Button
                type="dashed"
                onClick={() => {
                  model.update({
                    content: denseContent(),
                  });
                }}
              >
                全连接层
              </Button>

              <Divider type="vertical"></Divider>

              <Button
                type="dashed"
                onClick={() => {
                  model.update({
                    content: conv2dContent(),
                  });
                }}
              >
                {" "}
                2d卷积层{" "}
              </Button>
            </Col>
          </Row>
        );

        let activations = (v: string, f: Function) => {
          return (
            <Select
              defaultValue={v}
              style={{ width: 120 }}
              onChange={(value) => {
                f(value);
              }}
            >
              <Option value="relu">relu</Option>
              <Option value="sigmoid">sigmoid</Option>
            </Select>
          );
        };

        let denseContent = () => {
          let tempType = "Dense";
          let tempSize = "1";
          let tempActivation = "relu";

          return (
            <Row>
              {content2}
              <Divider type="horizontal"></Divider>
              <Row>
                <Input
                  key="denseSize"
                  addonBefore={"节点数目"}
                  style={{ width: "150px" }}
                  defaultValue={tempSize}
                  onChange={(event) => {
                    tempSize = event.target.value;
                  }}
                ></Input>
                <Divider type="vertical"></Divider>
                <Tag color="red">激活函数</Tag>
                {activations(tempActivation, (value: any) => {
                  tempActivation = value;
                })}
              </Row>
              <Divider></Divider>
              <Row justify="center">
                <Button
                  type="primary"
                  onClick={async () => {
                    let tempModelStruct = modelStructure.slice();
                    let step1 = async () => {
                      tempModelStruct.splice(index + 1, 0, {
                        index: index + 1,
                        type: tempType,
                        size: tempSize,
                        activation: tempActivation,
                      });
                    };

                    let step2 = async () => {
                      tempModelStruct = tempModelStruct.map(
                        (value: any, index: number) => {
                          let v = value;
                          v["index"] = index;
                          return v;
                        }
                      );
                    };

                    await step1();
                    await step2();

                    console.log("index", tempModelStruct);

                    setModelStructure(tempModelStruct);
                    console.log(modelStructure);
                    Modal.destroyAll();
                  }}
                >
                  向下添加
                </Button>
              </Row>
            </Row>
          );
        };

        //  input, filters, strides, padding
        let conv2dContent = () => {
          let tempType = "Conv2d";
          let tempFilters = "[3,3]";
          let tempStrides = "2";
          let tempPadding = "zero";

          return (
            <Row>
              {content2}
              <Divider type="horizontal"></Divider>
              <Row>
                <Input
                  key="conv2dFilters"
                  addonBefore={"卷积核"}
                  style={{ width: "150px" }}
                  defaultValue={tempFilters}
                  onChange={(event) => {
                    tempFilters = event.target.value;
                  }}
                ></Input>
                <Divider type="vertical"></Divider>

                <Input
                  addonBefore={"步长"}
                  style={{ width: "150px" }}
                  defaultValue={tempStrides}
                  onChange={(event) => {
                    tempStrides = event.target.value;
                  }}
                ></Input>
                <Divider type="vertical"></Divider>
                <Input
                  addonBefore={"填充方式"}
                  style={{ width: "150px" }}
                  defaultValue={tempPadding}
                  onChange={(event) => {
                    tempPadding = event.target.value;
                  }}
                ></Input>
                <Divider type="vertical"></Divider>
              </Row>
              <Divider></Divider>
              <Row justify="center">
                <Button
                  type="primary"
                  // let tempType = "Conv2d";
                  // let tempFilters = "[3,3]";
                  // let tempStrides = "2";
                  // let tempPadding = "zero";
                  onClick={async () => {
                    let tempModelStruct = modelStructure.slice();
                    let step1 = async () => {
                      tempModelStruct.splice(index + 1, 0, {
                        index: index + 1,
                        type: tempType,
                        filters: tempFilters,
                        strides: tempStrides,
                        padding: tempPadding,
                      });
                    };

                    let step2 = async () => {
                      tempModelStruct = tempModelStruct.map(
                        (value: any, index: number) => {
                          let v = value;
                          v["index"] = index;
                          return v;
                        }
                      );
                    };

                    await step1();
                    await step2();

                    console.log("index", tempModelStruct);

                    setModelStructure(tempModelStruct);
                    console.log(modelStructure);
                    Modal.destroyAll();
                  }}
                >
                  向下添加
                </Button>
              </Row>
            </Row>
          );
        };

        model.update({
          content: content1,
        });
      })
    );
  }, [modelStructure]);

  const props = {
    name: "input",
    // accept:".txt,.csv",
    beforeUpload: (file: any, fileList: any) => {
      return false;
    },
    showUploadList: false,
    //   action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        let fileName = _.get(info, "file.name", "未提交");
        let fileSize = _.get(info, "file.size", 0);
        setFile(info.file);
        setFN(fileName);
        setFSize(fileSize);
      }
    },
  };

  let CsvDragger = () => {
    return (
      <Dragger {...props} style={{ width: "300px" }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          拖动文件至此处 <br />
          或者 点击上传
          <br />
          上传资料文件 仅限 csv
          <br />
        </p>
        <p className="ant-upload-text" style={{ color: "red" }}>
          {fN}
        </p>
      </Dragger>
    );
  };

  let ConfigModelPanel = () => {
    return (
      <Row justify="center" gutter={10}>
        <Col>
          <Row justify="center" gutter={10}>
            模型层级结构, auto 尺寸会根据输入文件自动计算
          </Row>
          <Row justify="center" gutter={10}>
            {modelViews}
          </Row>
        </Col>
      </Row>
    );
  };

  return (
    <Row justify="center" gutter={10}>
      <Col flex={1}>
        <Row justify="center">
          <CsvDragger></CsvDragger>
        </Row>
        <Row justify="center" gutter={10}>
          {prettyBytes(fSize)}
        </Row>
        <Row justify="center" gutter={10}>
          <Input
            addonBefore={"导出模型名称"}
            value={modelN}
            onChange={(event) => {
              let textValue = event.target.value;
              if (/^[a-zA-Z0-9]+$/.test(textValue)) {
                setModelN(event.target.value);
              } else {
                setModelN("");
                let config = {
                  content: <p>模型名称只能由大小写字母和数字构成</p>,
                  duration: 3,
                };
                message.error(config);
              }
            }}
            placeholder={"只有大小写英文"}
            style={{ width: "300px" }}
          ></Input>
        </Row>
        <Row justify="center">
          <Button
            type="default"
            onClick={() => {
              formData.set("modelname", modelN);
              formData.set("csvsize", prettyBytes(fSize));
              formData.set("csvname", fN);
              formData.set("file", file);
              formData.set("modelstructure", JSON.stringify(modelStructure));
              putJobApi(formData);
              setModelN("");
            }}
            disabled={
              _.isEqual(fN, "未提交") || _.isEqual(modelN, "") ? true : false
            }
          >
            提交任务 <VerticalAlignTopOutlined />
          </Button>
        </Row>
      </Col>
      <Col flex={2}>{ConfigModelPanel()}</Col>
    </Row>
  );
};
