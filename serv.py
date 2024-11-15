import os
from logging.config import fileConfig

from dotenv import load_dotenv
from sanic import Sanic
from sanic.response import empty

import controllers
from common.route_utility import autodiscover
from config import serv

# 加载日志配置文件
fileConfig("config/logging.conf"***REMOVED***

# 加载环境变量
load_dotenv(***REMOVED***

app = Sanic("sanic-web"***REMOVED***
autodiscover(
    app,
    controllers,
    recursive=True,
***REMOVED***

app.route("/"***REMOVED***(lambda _: empty(***REMOVED******REMOVED***


if __name__ == "__main__":
    app.run(host=serv.host, port=serv.port, workers=serv.workers***REMOVED***
