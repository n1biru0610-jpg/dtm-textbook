#!/bin/sh
# ステップ8を作り直す：main（v1.29.0）の index.html から、スウィングを組み込み、版を v1.30.0 にする
set -e
cd "$(dirname "$0")/../.."
git checkout before-step-8 -- index.html preview/index.html 2>/dev/null || git checkout main -- index.html preview/index.html
python3 _dev/tools/sw_daw.py
B=$(python3 -c "import json;print(json.load(open('version.json'))['build'])")
sed -i "s/var APP_VER='[0-9.]*',APP_BUILD='[^']*'/var APP_VER='1.30.0',APP_BUILD='$B'/" index.html preview/index.html
grep -c "APP_VER='1.30.0',APP_BUILD='$B'" index.html preview/index.html
