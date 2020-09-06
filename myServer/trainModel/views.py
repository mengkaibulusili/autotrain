from django.shortcuts import render
import scriptTools.mydecorator as mydecorator
from scriptTools.dealCsv import dealCsvFile
from scriptTools.shareQuene import shareQ
import json
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt


from trainModel.models import JobInfo

import uuid

# data = serializers.serialize("json", vips.VipsInfo.objects.all(), fields=("name","tele"))

# Create your views here.
@mydecorator.httpTry
def usefucbyname(request, fucname):
  return eval(fucname)(request)


@mydecorator.httpRes
def putJob(request):
    # <QueryDict: {'modelname': ['a'], 'filesize': ['218 B']}>
    sFile =  request.FILES.get('file')
    postDict =  dict(request.POST)
    data =  { x:postDict[x][0] for x in postDict.keys() } 
    uid = str(uuid.uuid1()).replace("-","")
    data["jobuuid"]=uid

    csvName = data["csvname"] if data.__contains__("csvname") else ""
    if not csvName.endswith(".csv"):
        raise Exception("file must end with csv")
    if csvName != "":
        data["savedir"]=dealCsvFile(uid,"input.csv",sFile)

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
  data = json.loads(request.GET.get("data") )
  modelname = data["modelname"]
  jobstatus = data["jobstatus"]
  createtime = data["createtime"]
  return json.loads(serializers.serialize("json", JobInfo.objects.filter(
    modelname__contains=modelname,
    jobstatus__contains=jobstatus,
    createtime__contains=createtime,
  ).order_by('-createtime')))


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