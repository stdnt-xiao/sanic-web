from glob import glob
from importlib import import_module, util
from inspect import getmembers
from pathlib import Path
from types import ModuleType
from typing import Union

from sanic.blueprints import Blueprint


def autodiscover(app, *module_names: Union[str, ModuleType], recursive: bool = False***REMOVED***:
    """
    自动扫描目录添加蓝图/路由信息
    :param app:
    :param module_names:
    :param recursive:
    """
    mod = app.__module__
    blueprints = set(***REMOVED***
    _imported = set(***REMOVED***

    def _find_bps(module***REMOVED***:
        nonlocal blueprints

        for _, member in getmembers(module***REMOVED***:
            if isinstance(member, Blueprint***REMOVED***:
                blueprints.add(member***REMOVED***

    for module in module_names:
        if isinstance(module, str***REMOVED***:
            module = import_module(module, mod***REMOVED***
            _imported.add(module.__file__***REMOVED***
        _find_bps(module***REMOVED***

        if recursive:
            base = Path(module.__file__***REMOVED***.parent
            for path in glob(f"{base***REMOVED***/**/*.py", recursive=True***REMOVED***:
                if path not in _imported:
                    name = "module"
                    if "__init__" in path:
                        *_, name, __ = path.split("/"***REMOVED***
                    spec = util.spec_from_file_location(name, path***REMOVED***
                    speckled = util.module_from_spec(spec***REMOVED***
                    _imported.add(path***REMOVED***
                    spec.loader.exec_module(speckled***REMOVED***
                    _find_bps(speckled***REMOVED***

    for bp in blueprints:
        app.blueprint(bp***REMOVED***
