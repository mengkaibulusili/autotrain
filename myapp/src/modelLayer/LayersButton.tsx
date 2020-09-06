import { Flatten, Dense } from "./Layers";
import { Row, Col, Divider, Card, Tag, Button } from "antd";
import React from "react";
import * as _ from "lodash";
import { SettingTwoTone } from "@ant-design/icons";
import ReactJson from "react-json-view";

let ColStyle = {
  border: "black solid 1px  ",
  borderRadius: "10px",
  justifyContent: "center",
  alignItems: "center",
};

export let ModelLayersView = (layers: Array<any>, f: Function) => {
  console.log("layssss信息", layers);
  console.log("layssssfunc", f);
  let layersView = layers.map((layer: any, index: number) => {
    let l0 = layer;
    l0["index"] = index;
    let layerView = <Row></Row>;
    let type = _.get(layer, "type", "");
    if (_.isEqual(type, "Flatten")) {
      layerView = (
        <FlattenButton key={index.toString()} layer={l0} f={f}></FlattenButton>
      );
    } else if (_.isEqual(type, "Dense")) {
      layerView = (
        <DenseButton key={index.toString()} layer={l0} f={f}></DenseButton>
      );
    }
    return layerView;
  });

  return (
    <Row justify="center" gutter={20}>
      <Col>
        <Divider />
        {layersView}
      </Col>
    </Row>
  );
};

export let FlattenButton = (layer: any) => {
  let l: Flatten = layer.layer;
  let f: Function = layer.f;

  console.log("layx信息", l);
  console.log("lay函数", f);

  return (
    <Row gutter={10}>
      <Col style={ColStyle}>
        <Tag color="purple">类型</Tag>
        <p> {l.type} </p>
      </Col>

      <Divider type="vertical"></Divider>

      <Col style={ColStyle}>
        <Tag color="cyan">尺寸</Tag>
        <p> {l.inputShape} </p>
      </Col>

      <Divider type="vertical"></Divider>

      <Col style={ColStyle}>
        <Col>
          <Tag color="lime">修改</Tag>
        </Col>
        <Col>
          <Button
            icon={<SettingTwoTone />}
            onClick={() => {
              f(l.index);
            }}
          ></Button>
        </Col>
      </Col>
      <Divider />
    </Row>
  );
};

export let DenseButton = (layer: any) => {
  let l: Dense = layer.layer;
  let f: Function = layer.f;

  return (
    <Row gutter={10}>
      <Col style={ColStyle}>
        <Tag color="purple">类型</Tag>
        <p> {l.type} </p>
      </Col>

      <Divider type="vertical"></Divider>

      <Col style={ColStyle}>
        <Tag color="cyan">节点数目</Tag>
        <p> {l.size} </p>
      </Col>
      <Divider type="vertical"></Divider>

      <Col style={ColStyle}>
        <Tag color="volcano">激活函数</Tag>
        <p> {l.activation} </p>
      </Col>

      <Divider type="vertical"></Divider>

      <Col style={ColStyle}>
        <Col>
          <Tag color="lime">修改</Tag>
        </Col>
        <Col>
          <Button
            icon={<SettingTwoTone />}
            onClick={() => {
              f(l.index);
            }}
          ></Button>
        </Col>
      </Col>
      <Divider />
    </Row>
  );
};
