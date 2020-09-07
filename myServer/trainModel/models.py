from django.db import models
import uuid
import scriptTools.timeTools as tTools

charlen = 200
longercharlen = 1000

# Create your models here.
class JobInfo(models.Model):
    jobid = models.AutoField(primary_key=True, auto_created=True)
    jobuuid = models.CharField( default="", blank=True, max_length=charlen)
    jobstatus = models.CharField( default="未开始",blank=True, max_length=charlen)

    createtime = models.CharField( default=tTools.dateStdTime, max_length=charlen, blank=True)
    starttime = models.CharField( default="_", max_length=charlen, blank=True)
    endtime = models.CharField( default="_", max_length=charlen, blank=True)

    savedir = models.CharField( default="",blank=True, max_length=charlen)
    csvname = models.CharField( default="null__",blank=True, max_length=charlen)
    csvsize = models.CharField( default="0",blank=True, max_length=charlen)

    modelname = models.CharField( default="null__",blank=True, max_length=charlen)
    modelsize = models.CharField(default="0",blank=True, max_length=charlen)
    modelstructure = models.CharField(default=r'{}',blank=True, max_length=longercharlen)

    modeltotalsample = models.CharField(default="0",blank=True, max_length=charlen)
    modeltrainsample = models.CharField(default="0",blank=True, max_length=charlen)
    modeltestsample = models.CharField(default="0",blank=True, max_length=charlen)
    modelvalidasample = models.CharField(default="0",blank=True, max_length=charlen)
