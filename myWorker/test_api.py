import json
import requests
import os
import dealCsv
import numpy
from urllib.parse import urlencode

proxy = "http://localhost:8000"


def setJobStatue(job_uuid, job_statues) -> bool:
  jobApi = "/api/trainModel/setJobStatues/"
  url = proxy + jobApi
  data = {"job_uuid": job_uuid, "job_statues": job_statues}
  query_data = {"data": json.dumps(data, ensure_ascii=False)}
  r = requests.get(url, params=query_data)
  r_dict = json.loads(r.content.decode("utf8"))

  if r_dict["code"] == "0":
    return True
  return False


if __name__ == "__main__":
  r = setJobStatue("6b433933f26711eaa47e8030491cc416", "运行中")
  print(r)