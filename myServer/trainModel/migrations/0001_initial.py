# Generated by Django 3.1.1 on 2020-09-05 10:50

from django.db import migrations, models
import scriptTools.timeTools


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='JobInfo',
            fields=[
                ('jobid', models.AutoField(auto_created=True, primary_key=True, serialize=False)),
                ('jobuuid', models.CharField(blank=True, default='', max_length=200)),
                ('jobstatus', models.CharField(blank=True, default='未开始', max_length=200)),
                ('createtime', models.CharField(blank=True, default=scriptTools.timeTools.dateStdTime, max_length=200)),
                ('starttime', models.CharField(blank=True, default='_', max_length=200)),
                ('endtime', models.CharField(blank=True, default='_', max_length=200)),
                ('csvname', models.CharField(blank=True, default='null__', max_length=200)),
                ('csvsize', models.CharField(blank=True, default='0', max_length=200)),
                ('modelname', models.CharField(blank=True, default='null__', max_length=200)),
                ('modelsize', models.CharField(blank=True, default='0', max_length=200)),
                ('modelstructure', models.CharField(blank=True, default='0', max_length=200)),
                ('modeltotalsample', models.CharField(blank=True, default='0', max_length=200)),
                ('modeltrainsample', models.CharField(blank=True, default='0', max_length=200)),
                ('modeltestsample', models.CharField(blank=True, default='0', max_length=200)),
                ('modelvalidasample', models.CharField(blank=True, default='0', max_length=200)),
            ],
        ),
    ]