from django.shortcuts import render
from scriptTools import mydecorator
from django.http import FileResponse
import json
import os


# Create your views here.
@mydecorator.httpTry
def usefucbyname(request, fucname):
  return eval(fucname)(request)


def downloadByName(request):
  dirName = os.path.dirname(__file__)
  resqData = json.loads(request.GET.get("data"))
  filename = resqData["file_name"]
  downFile = open(os.path.join(dirName, "docs/{}".format(filename)), 'rb')
  response = FileResponse(downFile)
  response['Content-Type'] = 'application/octet-stream'
  response['Content-Disposition'] = 'attachment;filename="{}"'.format(filename)
  return response