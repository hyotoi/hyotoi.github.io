FROM jekyll/jekyll:4.2.2

WORKDIR /srv/jekyll

# entr 설치 (Alpine 기반)
RUN apk update && apk add --no-cache entr bash

# Gem 설치 (이미지에 따라 캐시 최적화)
COPY Gemfile ./
RUN bundle install

# 소스 복사
COPY . .

# entrypoint 스크립트 복사
COPY script/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# 테스트용
EXPOSE 14000

#CMD ["jekyll", "serve", "--host", "0.0.0.0", "--port", "14000", "--force_polling"]
CMD ["/entrypoint.sh"]
