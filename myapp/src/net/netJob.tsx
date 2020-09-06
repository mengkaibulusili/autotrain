import { doGetRequest, GetRequestData, doPostRequest } from "./netDoRequest";
import { putJobUrl, getJobsByModelNameUrl } from "./netConfig";

export function putJobApi(fromData: Object) {
  doPostRequest(putJobUrl, fromData);
}

export async function getJobsByModelNameApi(queryData: Object) {
  let data = GetRequestData(getJobsByModelNameUrl, queryData);
  return data;
}

// export async function getAllProjApi(queryData: Object) {
//   let data = await GetRequestData(watchProjUrl, queryData);
//   return data;
// }
