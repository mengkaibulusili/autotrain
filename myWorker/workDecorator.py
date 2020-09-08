

def logErrAndContinue(f):
    def x(*args,**kwargs):
        try:
            f(*args,**kwargs)
        except Exception as e:
            print(str(e))
    return x
