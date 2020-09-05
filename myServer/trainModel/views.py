from django.shortcuts import render
import scriptTools.mydecorator as mydecorator
from scriptTools.dealCsv import dealCsvFile
from scriptTools.shareQuene import shareQ
import json
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

    print("上传的文件",request.FILES)
    data= request.POST
    print("Post内容",data)
    data:dict=json.loads(request.GET.get("data"))

    # 投递任务 ，如果投递失败 抛出 异常 之后的代码不会执行
    shareQ.q.put_nowait(data)

    uid = str(uuid.uuid1()).replace("-","")
    data["jobuuid"]=uid
    
    csvName = data["csvname"] if data.__contains__("csvname") else ""
    if csvName != "":
        dealCsvFile(uid,csvName,"")


    JobInfo(**data).save()



@mydecorator.httpData
def getJob(request):
    return shareQ.q.get_nowait()


@mydecorator.httpData
def getJobLen(request):
    return shareQ.q.qsize()


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