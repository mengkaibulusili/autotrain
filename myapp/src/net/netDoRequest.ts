import { dealResp } from "./netDealResp";
import { Gproxy, Gtimeout } from "./netConfig";
import axios from "axios";
import * as _ from "lodash";

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

export async function doPostRequest(url: string, formData: any) {
  let resq = {};
  try {
    resq = await axios.post(Gproxy + url,formData, {
      headers:{'Content-Type':'multipart/form-data'},
      timeout: Gtimeout,
    });
    dealResp(resq);
  } catch (err) {
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
  } finally {
  }
}
