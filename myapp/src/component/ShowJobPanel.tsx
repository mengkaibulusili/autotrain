import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Upload,
  Input,
  Button,
  message,
  Table,
  Select,
  Popover,
} from "antd";
import { AnyCnameRecord } from "dns";
import { RightCircleTwoTone, QuestionCircleTwoTone } from "@ant-design/icons";
import * as _ from "lodash";
import { getJobsByModelNameApi } from "../net/netJob";
import prettyBytes from "pretty-bytes";
import ReactJson from "react-json-view";

const { Option } = Select;

// {"code": "0", "message": "", "data": [{"model": "trainModel.jobinfo", "pk": 18, "fields": {"jobuuid": "a783b09eeffb11ea9c180871908061a4", "jobstatus": "未开始", "createtime": "20200906-12:44:32", "starttime": "_", "endtime": "_", "savedir": "C:\\gitproj\\autotrain\\myServer\\storeFiles\\a783b09eeffb11ea9c180871908061a4", "csvname": "mnist_train.csv", "csvsize": "110 MB", "modelname": "asasa12", "modelsize": "0", "modelstructure": "0", "modeltotalsample": "0", "modeltrainsample": "0", "modeltestsample": "0", "modelvalidasample": "0"}},

export let ShowJobPanel = () => {
  let [dataS, setDataS] = useState([]);
  let [modelName, setModelName] = useState("");
  let [jobStatues, setJonStatues] = useState("");
  let [createTime, setCreateTime] = useState("");

  async function loadData() {
    let params = {
      modelname: modelName,
      jobstatus: jobStatues,
      createtime: createTime,
    };
    let data: any = await getJobsByModelNameApi(params);
    console.log("回传的 data", data);
    setDataS(data);
  }

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      title: "任务id",
      dataIndex: "pk",
    },
    {
      title: "模型名称",
      dataIndex: ["fields", "modelname"],
    },
    {
      title: "创建时间",
      dataIndex: ["fields", "createtime"],
    },
    {
      title: "状态",
      dataIndex: ["fields", "jobstatus"],
    },
    {
      title: "任务详情",
      key: "detailInfo",
      render: (text: any, record: any, index: number) => {
        let viewContent = () => {
          console.log(record);
          return <ReactJson key="detailInfoReactJson" src={record}></ReactJson>;
        };
        return (
          <Popover
            key="detailInfoPopover"
            trigger="hover"
            placement="left"
            title={"任务详情"}
            content={viewContent()}
          >
            <Button
              key="detailInfoButton"
              type="default"
              icon={<QuestionCircleTwoTone key="detailInfoTone" />}
            ></Button>
          </Popover>
        );
      },
    },
    {
      title: "训练详情",
      key: "trainInfo",
      render: (text: any, record: any, index: number) => {
        return (
          <Button
            key="trainInfoButton"
            type="default"
            icon={<RightCircleTwoTone key="trainInfoTone" />}
            href={"/"}
            target="_blank"
          ></Button>
        );
      },
    },
  ];

  return (
    <Row gutter={10} justify="center">
      <Col>
        <Row gutter={10} justify="center">
          {" "}
          模糊匹配搜索部分数据 样例: 日期格式 20200906-12:44:32{" "}
        </Row>
        <Row gutter={10} justify="center">
          <Col>
            <Input
              addonBefore={"模型名称"}
              value={modelName}
              onChange={(event) => {
                let textValue = event.target.value;
                setModelName(textValue);
              }}
            />
          </Col>
          <Col>
            <Input
              addonBefore={"日期"}
              value={createTime}
              onChange={(event) => {
                let textValue = event.target.value;
                setCreateTime(textValue);
              }}
            />
          </Col>
          <Col>
            <Select
              defaultValue=""
              style={{ width: 120 }}
              onChange={(value) => {
                setJonStatues(value);
              }}
            >
              <Option value="">所有</Option>
              <Option value="未开始">未开始</Option>
              <Option value="执行中">执行中</Option>
              <Option value="已完成">已完成</Option>
              <Option value="失败">失败</Option>
            </Select>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={() => {
                loadData();
              }}
            >
              执行查询
            </Button>
          </Col>
        </Row>

        <Table
          rowKey={(record) => _.get(record, "pk", "x")}
          dataSource={dataS}
          columns={columns}
        />
      </Col>
    </Row>
  );
};
