from django.shortcuts import render
import scriptTools.mydecorator as mydecorator

# data = serializers.serialize("json", vips.VipsInfo.objects.all(), fields=("name","tele"))

# Create your views here.
@mydecorator.httpTry
def usefucbyname(request, fucname):
  return eval(fucname)(request)


@mydecorator.httpData
def test1(request):
    return {"name":"kiki"}

@mydecorator.httpRes
def success(request):
    a=1

@mydecorator.httpRes
def fail(request):
    a=[]
    a[2]=3