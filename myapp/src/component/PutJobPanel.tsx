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
  let d2: Dense = { index: 2, type: "Dense", size: "10", activation: "relu" };
  let [modelStructure, setModelStructure] = useState([f1, d1, d2]);

  let formData = new FormData();

  let [modelViews, setModelViews] = useState(<Row></Row>);

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
            {" "}
            <Button
              type="dashed"
              onClick={() => {
                if (_.isEqual(index, 0)) {
                  message.info({
                    content: <p>不可以删除输入层</p>,
                    duration: 3,
                  });
                } else {
                  let layers = modelStructure;
                  layers.splice(index, 1);
                  setModelStructure(layers.slice());
                  console.log(modelStructure);
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
              <Button type="dashed"> 卷积层 </Button>
              <Divider type="vertical"></Divider>
              <Button
                type="dashed"
                onClick={() => {
                  model.update({
                    content: denseContent,
                  });
                }}
              >
                全连接层{" "}
              </Button>
            </Col>
          </Row>
        );

        let activations = (
          <Select
            defaultValue="relu"
            style={{ width: 120 }}
            onChange={(value) => {}}
          >
            <Option value="relu">relu</Option>
            <Option value="sigmoid">sigmoid</Option>
          </Select>
        );

        let denseContent = (
          <Row>
            <Col>{content1}</Col>
            <Divider type="horizontal"></Divider>
            <Row>
              <Button type="dashed"> 卷积层 </Button>
              <Divider type="vertical"></Divider>
              <Button type="dashed"> 全连接层 </Button>
            </Row>
            <Divider type="horizontal"></Divider>
            <Row>
              <Input
                addonBefore={"节点数目"}
                style={{ width: "150px" }}
              ></Input>
              <Divider type="vertical"></Divider>
              <Tag color="red">激活函数</Tag>
              {activations}
            </Row>
          </Row>
        );

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
            模型层级结构
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
