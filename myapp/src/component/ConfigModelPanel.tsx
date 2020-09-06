import React, { useState } from "react";
import { Row, Col, Upload, Input, Button, message } from "antd";
import { AnyCnameRecord } from "dns";
import { InboxOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";
import * as _ from "lodash";
import { putJobApi } from "../net/netJob";
import prettyBytes from "pretty-bytes";

const { Dragger } = Upload;

// File {uid: "rc-upload-1599299523945-2", name: "新建文本文档.txt", lastModified: 1598709911529, lastModifiedDate: Sat Aug 29 2020 22:05:11 GMT+0800 (中国标准时间), webkitRelativePath: "", …}
// lastModified: 1598709911529
// lastModifiedDate: Sat Aug 29 2020 22:05:11 GMT+0800 (中国标准时间) {}
// name: "新建文本文档.txt"
// size: 218
// type: "text/plain"
// uid: "rc-upload-1599299523945-2"
// webkitRelativePath: ""
// __proto__: File

export let ConfigModelPanel = () => {
  let [fN, setFN] = useState("未提交");
  let [modelN, setModelN] = useState("");
  let [fSize, setFSize] = useState(0);
  let [file, setFile] = useState("");

  let formData = new FormData();

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

  return (
    <Row gutter={10}>
      <Col flex={1}>
        <Row justify="center">
          <CsvDragger></CsvDragger>
        </Row>
        <Row justify="center">{prettyBytes(fSize)}</Row>
        <Row justify="center">
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
      <Col flex={1}></Col>
    </Row>
  );
};
