import os, sys, platform, signal, time
from multiprocessing import Pool, freeze_support


def start_myApp():
  workdir = os.path.dirname(os.path.dirname(__file__))
  workdir = os.path.join(workdir, "myapp")
  os.chdir(workdir)
  r = os.system("npm start")
  print("myapp return {}".format(r))


def start_myServer():
  workdir = os.path.dirname(os.path.dirname(__file__))
  workdir = os.path.join(workdir, "myServer")
  os.chdir(workdir)
  r = os.system("python ./manage.py runserver ")
  print("myServer return {}".format(r))


def start_myWorker():
  workdir = os.path.dirname(os.path.dirname(__file__))
  workdir = os.path.join(workdir, "myWorker")
  os.chdir(workdir)
  r = os.system("python ./doJob.py ")
  print("myWorker return {}".format(r))


def quit(signum, frame):
  print('所有进程已关闭')
  sys.exit()


if __name__ == "__main__":
  freeze_support()
  try:
    signal.signal(signal.SIGINT, quit)
    signal.signal(signal.SIGTERM, quit)
    process_pool = Pool(processes=3)
    # with Pool(processes=3) as process_pool:
    r_app = process_pool.apply_async(start_myApp)
    r_server = process_pool.apply_async(start_myServer)
    r_worker = process_pool.apply_async(start_myWorker)
    # process_pool.close()
    # process_pool.join()
    while True:
      time.sleep(0.001)
  except KeyboardInterrupt:
    print('catch keyboardinterupterror')
    pid = os.getpid()
    if (platform.system() == 'Windows'):
      os.popen('taskkill.exe /f /pid:{}'.format(pid))  #在unix下无需此命令，但在windows下需要此命令强制退出当前进程
  except Exception as e:
    print(e)
    print("don,t no error ")
  else:
    print('quit normally')
