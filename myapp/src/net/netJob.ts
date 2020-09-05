import { doGetRequest, GetRequestData, doPostRequest } from "./netDoRequest";
import { putJobUrl } from "./netConfig";

export async function putJobApi(fromData: Object) {
  doPostRequest(putJobUrl, fromData);
}

// export async function getAllProjApi(queryData: Object) {
//   let data = await GetRequestData(watchProjUrl, queryData);
//   return data;
// }
