import { doGetRequest } from "./netDoRequest";
import { Gproxy, Gtimeout } from "./netConfig";
import { downloadUrl } from "./netConfig";
import axios from "axios";
import * as _ from "lodash";
import { message } from "antd";

export async function doGetRequestDownFile(url: string, queryData: Object) {
  let resq = {};
  try {
    resq = await axios.get(Gproxy + url, {
      params: {
        data: JSON.stringify(queryData),
      },
      timeout: Gtimeout,
      responseType: "blob",
    });
    const fileurl = window.URL.createObjectURL(
      new Blob([_.get(resq, "data", "")])
    );
    const link = document.createElement("a");
    link.href = fileurl;
    link.setAttribute("download", _.get(queryData, "file_name", "demo.txt"));
    document.body.appendChild(link);
    link.click();
    message.info("下载成功");
  } catch (err) {
    message.info(err);
  }
}

export let downloadMnist = () => {
  let queryParams = { file_name: "small_mnist_train.csv" };
  doGetRequestDownFile(downloadUrl, queryParams);
};
