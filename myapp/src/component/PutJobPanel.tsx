import React, { useState } from "react";
import { PutCustomJob } from "./PutCustomJob";
import { Layout, Menu, Typography } from "antd";

const { Title } = Typography;

import * as _ from "lodash";
import SubMenu from "antd/lib/menu/SubMenu";

const { Header, Content, Footer, Sider } = Layout;

export let PutJobPanel = () => {
  let [isCollapsed, setIsCollapsed] = useState(false);

  let [jobType, setjobType] = useState("custom");

  let ShowJobPage = () => {
    if (_.isEqual("custom", jobType)) {
      return <PutCustomJob />;
    }
    return <Title>未上线</Title>;
  };

  return (
    <Layout>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
        }}
        collapsible={true}
        collapsed={isCollapsed}
        onCollapse={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        <Menu theme="dark" defaultSelectedKeys={["custom"]} mode="inline">
          <Menu.Item
            key="custom"
            onClick={() => {
              setjobType("custom");
            }}
          >
            自定义分类模型
          </Menu.Item>
          <SubMenu key="objectDetection" title=" 目标检测模型">
            <Menu.Item
              key="objectDetectionSsd"
              onClick={() => {
                setjobType("");
              }}
            >
              Ssd
            </Menu.Item>
            <Menu.Item
              key="objectDetectionYolo"
              onClick={() => {
                setjobType("");
              }}
            >
              Yolo
            </Menu.Item>
            <Menu.Item
              key="objectDetectionRcnn"
              onClick={() => {
                setjobType("");
              }}
            >
              Rcnn
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="bert" onClick={() => {}}>
            bert模型
          </Menu.Item>
          <Menu.Item key="classify" onClick={() => {}}>
            分类模型
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            lineHeight: "25px",
            borderTop: "0px",
            backgroundColor: "orange",
            fontSize: "25px",
            height: "30px",
          }}
        >
          autoTrain ©2020 Created by kiki
        </Header>
        {/* <Content style={{ margin: "24px 16px 0", overflow: "initial" }}> */}
        <Content style={{ margin: "0 16px" }}>{ShowJobPage()}</Content>
        <Footer
          style={{
            textAlign: "center",
            fontSize: "25px",
            backgroundColor: "mintcream",
          }}
        >
          email: 734449600@qq.com
        </Footer>
      </Layout>
    </Layout>
  );
};
