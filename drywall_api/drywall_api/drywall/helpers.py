import pytz

sg_tz = pytz.timezone("Asia/Singapore")
sg_tz = sg_tz.localize(pytz.datetime.datetime.now()).tzinfo

default_start = lambda: tz_now(sg_tz)
default_start_formated = lambda: default_start().strftime("%Y-%m-%d")
