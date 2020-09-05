import * as _ from "lodash";
import React from "react";
import { message, Card } from "antd";

export let dealResp = (resq: any) => {
  console.log(resq);
  let config: any = { top: 200 };
  if (
    _.isEqual(_.get(resq, "status", -1), 200) &&
    _.isEqual(_.get(resq, "data.code", "-1"), "0")
  ) {
    config["content"] = <pre>操作成功</pre>;
    message.success(config);
  } else if (
    _.isEqual(_.get(resq, "status", -1), 200) &&
    _.isEqual(_.get(resq, "data.code", "-1"), "-1")
  ) {
    config["content"] = (
      <Card title="操作失败,字段错误">
        {_.get(resq, "data.message", "未知错误")}
      </Card>
    );
    message.error(config);
  } else if (!_.isEqual(_.get(resq, "status", -1), 200)) {
    config["content"] = (
      <Card title="网络故障">{_.get(resq, "data.message", "未知错误")}</Card>
    );
    message.error(config);
  }
};
