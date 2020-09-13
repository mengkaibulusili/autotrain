from django.shortcuts import render
import scriptTools.mydecorator as mydecorator
from scriptTools.dealCsv import dealCsvFile
from scriptTools.shareQuene import shareQ
from scriptTools.timeTools import dateStdTime
import json
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt

from trainModel.models import JobInfo

import uuid
import os

import shutil

# data = serializers.serialize("json", vips.VipsInfo.objects.all(), fields=("name","tele"))

statues_running = "执行中"
statues_success = "已完成"
statues_fail = "失败"


# Create your views here.
@mydecorator.httpTry
def usefucbyname(request, fucname):
  return eval(fucname)(request)


@mydecorator.httpRes
def putJob(request):
  # <QueryDict: {'modelname': ['a'], 'filesize': ['218 B']}>
  sFile = request.FILES.get('file')
  postDict = dict(request.POST)
  data = {x: postDict[x][0] for x in postDict.keys()}
  uid = str(uuid.uuid1()).replace("-", "")
  data["jobuuid"] = uid

  csvName = data["csvname"] if data.__contains__("csvname") else ""
  if not csvName.endswith(".csv"):
    raise Exception("file must end with csv")
  if csvName != "":
    data["savedir"] = dealCsvFile(uid, "input.csv", sFile)

  # 投递任务 ，如果投递失败 抛出 异常 之后的代码不会执行
  shareQ.q.put_nowait(data)

  # the JSON object must be str, bytes or bytearray, not NoneType
  JobInfo(**data).save()


@mydecorator.httpData
def getJob(request):
  return shareQ.q.get_nowait()


@mydecorator.httpData
def getJobLen(request):
  return shareQ.q.qsize()


@mydecorator.httpData
def getAllJobInfo(request):
  data = json.loads(request.GET.get("data"))
  modelname = data["modelname"]
  jobstatus = data["jobstatus"]
  createtime = data["createtime"]
  return json.loads(serializers.serialize("json",
                                          JobInfo.objects.filter(
                                            modelname__contains=modelname,
                                            jobstatus__contains=jobstatus,
                                            createtime__contains=createtime,
                                          ).order_by('-createtime')))


@mydecorator.httpRes
def setJobStatues(request):
  data = json.loads(request.GET.get("data"))
  job_uuid = data["job_uuid"]
  job_statues = data["job_statues"]
  error_message = data["error_message"]
  x = JobInfo.objects.get(jobuuid=job_uuid)
  if job_statues == statues_running:
    x.starttime = dateStdTime()
  elif (job_statues == statues_success) or (job_statues == statues_fail):
    x.endtime = dateStdTime()
  x.jobstatus = job_statues
  x.errormessage = error_message
  x.save()

  print(data)


# 拷贝任务的 tensorboard logs 到  myTensorBroad 目录


@mydecorator.httpRes
def changeLogsPath(request):
  data = json.loads(request.GET.get("data"))
  job_uuid = data["job_uuid"]
  print("uuid", job_uuid)
  x = JobInfo.objects.get(jobuuid=job_uuid)

  logs_dir = os.path.join(x.savedir, "logs")
  myTensorBoardLogPath = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
  myTensorBoardLogPath = os.path.join(myTensorBoardLogPath, "myTensorBoard/logs")

  message = os.system('docker stop tsboard')
  print("deckor", message)

  if os.path.exists(myTensorBoardLogPath):
    shutil.rmtree(myTensorBoardLogPath)
  shutil.copytree(logs_dir, myTensorBoardLogPath)

  message = os.system('docker run -itd -p 6006:6006 -v C:/gitproj/autotrain/myTensorBoard/logs:/root/logs --rm --name tsboard tensorflow/tensorflow:nightly-py3-jupyter "tensorboard" "--logdir" "/root/logs" "--bind_all"')
  print("deckor", message)


# def get_user_profiles(request):
#     if request.method == 'POST':
#         if request.FILES:
#             myFile =None
#             for i in request.FILES:
#                 myFile = request.FILES[i]
#             if myFile:
#                 dir = os.path.join(os.path.join(BASE_DIR, 'static'),'profiles')
#                 destination = open(os.path.join(dir, myFile.name),
#                                    'wb+')
#                 for chunk in myFile.chunks():
#                     destination.write(chunk)
#                 destination.close()
#             return HttpResponse('ok')

# def get_user_profiles(request):
#     if request.method == 'POST':
#             myFile = request.FILES.get("filename", None)
#             if myFile:
#                 dir = os.path.join(os.path.join(BASE_DIR, 'static'),'profiles')
#                 destination = open(os.path.join(dir, myFile.name),
#                                    'wb+')
#                 for chunk in myFile.chunks():
#                     destination.write(chunk)
#                 destination.close()
#             return HttpResponse('ok')