import React from "react";
import { Button, Popover, Row, Tag, Typography } from "antd";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import { downloadMnist } from "../net/netDownloadFile";

// import mnistFileUrl from "../docs/small_mnist_train.csv";
// let mnistFileUrl = "/docs/small_mnist_train.csv";

const { Title, Paragraph, Text } = Typography;

export let CustomHelpView = () => {
  let titleContent = () => {
    return (
      <Title style={{ width: "700px", fontSize: "25px" }}>
        自定义模型帮助文档
      </Title>
    );
  };

  let textContent = () => {
    return (
      <Paragraph style={{ width: "700px", fontSize: "20px" }}>
        <Paragraph>
          自定义训练模型是一个实现了 <Text mark>自由堆砌</Text>
          全连接层的
          <Text mark>体验式交互模型</Text>.
        </Paragraph>
        <Paragraph>
          <Text mark>注意事项!</Text>
        </Paragraph>
        <ol>
          <li>自定义模型功能简单,仅限于处理分类,拟合</li>
          <li>如有特定需求，请在左侧菜单栏选取适合自己的模型</li>
        </ol>
        <Paragraph>
          <Text mark>输入文件!</Text>
        </Paragraph>
        <ol>
          <li>
            将分类标签放置在csv 每行 的 第一列，其余每列防止 平铺开的参数即可
          </li>
          <li>例如手写数字识别</li>
          <Button
            onClick={() => {
              downloadMnist();
            }}
          >
            下载 mnist 手写体数字识别样例
          </Button>
          <li>请将样例 拖放至 下方文件上传区域</li>
          <li>为您要导出的模型 命名</li>
          <li>修改右侧 模型结构 后(可选,默认采用右侧结构)</li>
          <li>提交任务</li>
          <li>等待 自动训练 模型</li>
          <li>通过左上角 任务按钮 ,进入 查看任务,即可 查看 任务训练详情</li>
        </ol>
      </Paragraph>
    );
  };
  return (
    <Popover
      placement="bottom"
      title={titleContent()}
      content={textContent()}
      trigger="hover"
    >
      <Row>
        <Button size={"large"} icon={<QuestionCircleTwoTone />}></Button>
        <Tag style={{ display: "flex", alignItems: "center" }} color="red">
          使用说明
        </Tag>
      </Row>
    </Popover>
  );
};
