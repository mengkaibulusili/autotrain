import {
  doGetRequest,
  GetRequestData,
  doPostRequest,
  GetRequestCode,
} from "./netDoRequest";
import {
  putJobUrl,
  getJobsByModelNameUrl,
  changeLogsPathUrl,
} from "./netConfig";

export function putJobApi(fromData: Object) {
  doPostRequest(putJobUrl, fromData);
}

export async function getJobsByModelNameApi(queryData: Object) {
  let data = await GetRequestData(getJobsByModelNameUrl, queryData);
  return data;
}

export async function setLogsPathApi(queryData: Object) {
  let data = await GetRequestCode(changeLogsPathUrl, queryData);
  return data;
}

// export async function getAllProjApi(queryData: Object) {
//   let data = await GetRequestData(watchProjUrl, queryData);
//   return data;
// }
