#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from glob import glob
from json import load
from os.path import split

with open("README.md", "w+", encoding="utf-8") as fp:
    fp.write("# Aliucord RN plugins\n\n")
    for path in sorted(glob("*/manifest.json")):
        plugin, _ = split(path)
        manifest = load(open(path))
        fp.write(f"- [{plugin}](https://github.com/c10udburst-discord/Aliucord-RightNow-Plugins/blob/builds/{plugin}.zip?raw=true): {manifest['description']}\n")
