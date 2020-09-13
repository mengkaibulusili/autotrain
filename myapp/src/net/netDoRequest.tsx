import { dealResp } from "./netDealResp";
import { Gproxy, Gtimeout } from "./netConfig";
import axios from "axios";
import * as _ from "lodash";
import React, { useState } from "react";
import { message, Card } from "antd";
import { observable } from "mobx";
import { observer } from "mobx-react";

export async function doGetRequest(url: string, queryData: Object) {
  let resq = {};
  try {
    resq = await axios.get(Gproxy + url, {
      params: {
        data: JSON.stringify(queryData),
      },
      timeout: Gtimeout,
    });
    dealResp(resq);
  } catch (err) {
    dealResp(resq);
  }
}

//  由于上传文件 超时时间 太长没防止用户陷莫名其妙的等待
//  我们可以再上传之前多一个  接口网络测试

export async function doPostRequest(url: string, formData: any) {
  let complete: any = observable({ showTest: "0 %" });
  let resq = {};
  try {
    let ShowNode = observer(() => {
      return (
        <Card title="上传中,请耐心等待">
          <p>{complete.showTest}</p>
        </Card>
      );
    });
    let uniqueKey = "loadingdatafile";
    let config = {
      content: <ShowNode></ShowNode>,
      key: uniqueKey,
      duration: 0,
    };
    message.loading(config);
    //文件可能很大，把  超时 时间放大 一些
    resq = await axios.post(Gproxy + url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 1000 * Gtimeout,
      onUploadProgress: function (progressEvent) {
        let tempcomplete =
          (((progressEvent.loaded / progressEvent.total) * 100) | 0) + "%";
        //  console.log('上传 ' + tempcomplete);
        complete.showTest = tempcomplete;
      },
    });
    message.destroy();
    dealResp(resq);
  } catch (err) {
    console.log(err);
    message.destroy();
    dealResp(resq);
  }
}

export async function GetRequestData(url: string, queryData: Object) {
  let resq = {};
  try {
    resq = await axios.get(Gproxy + url, {
      params: {
        data: JSON.stringify(queryData),
      },
      timeout: Gtimeout,
    });
    console.log("resq", resq);
    return _.get(resq, "data.data", {});
  } catch (err) {
    dealResp(resq);
    return [];
  }
}

export async function GetRequestCode(url: string, queryData: Object) {
  let resq = {};
  try {
    resq = await axios.get(Gproxy + url, {
      params: {
        data: JSON.stringify(queryData),
      },
      timeout: Gtimeout,
    });
    console.log("resq", resq);
    return _.get(resq, "data", {});
  } catch (err) {
    dealResp(resq);
    return [];
  }
}
