import multiprocessing
import os
from project_settings import project_name, port_number

bind = "127.0.0.1:{}".format(port_number)
timeout = 120
pidfile = os.path.dirname(__file__) + "process.pid"
workers = multiprocessing.cpu_count() * 2 + 1
accesslog = "/var/log/gunicorn/{}.log".format(project_name)
errorlog = "/var/log/gunicorn/{}.error.log".format(project_name)
