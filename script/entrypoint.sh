#!/bin/bash

if [[ "$ENV" == "dev" ]]; then
    echo "dev 모드 실행"
    echo "_config.yml" | entr -r sh -c 'echo "_config_dev.yml 변경 감지됨. Jekyll 서버 재시작!"; bundle exec jekyll clean; bundle exec jekyll serve --config _config_dev.yml --host 0.0.0.0 --port 14000 --force_polling;'
else
    echo "_config.yml 변경 감지됨. Jekyll 서버 재시작!";
    bundle exec jekyll clean;
    bundle exec jekyll serve --config _config.yml --host 0.0.0.0 --port 14000 --force_polling
fi

