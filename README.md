# 📚 목차

- [공통 가이드](#공통-가이드)
  - 홈페이지 구조 이해
  - 컨텐츠 수정 방법
  - 컨텐츠 반영/배포 방법

- [메뉴별 작성법](#메뉴별-작성법)
  - [소개](#소개)
    - 비전
    - 인사말
    - 단원소개
  - [공연안내](#공연안내)
    - 공연 일정
    - 지난 공연
  - [미디어](#미디어)
    - 공연 사진
    - 공연 영상
    - 언론보도
  - [고객지원](#고객지원)
    - 문의하기
    - 공지사항

- [부록](#부록)
  - 자주 묻는 질문
  - 참고 자료



# Usage

## Workflow

```shell
📦 A 저장소 (muse_profile)
   └─ Release 발생 (published)
        ↓
   trigger-dispatch.yml → repository_dispatch("sync_triggered") 전송
        ↓
🚀 B 저장소 (hyotoi.github.io)
   └─ sync.yml → muse_profile로부터 코드 clone + commit + push
        ↓
   publishing_page.yml → sync.yml 성공 시 배포 수행
```


## Release

[npm conventional-changelog-conventionalcommits](https://www.npmjs.com/package/conventional-changelog-conventionalcommits)


```shell
docker create --name sshon_node node:lts-alpine3.21
docker cp ~/.ssh sshon_node:/root/
docker run  -itd --name generate_release -v /home/codex/git/personal/muse_profile:/srv/jekyll -v /home/codex/.ssh:/root/.ssh --entrypoint /bin/sh node:lts-alpine3.21

chmod 700 ~/.ssh
chmod 600 ~/.ssh/config
chown root:root ~/.ssh ~/.ssh/*

apk add git openssh-client
git config --global --add safe.directory /srv/jekyll
cd /srv/jekyll
npm install --save-dev release-it @release-it/conventional-changelog
npm install --save-dev conventional-changelog-cli
npx release-it
npx conventional-changelog -p conventionalcommits -r 0 --from v1.2.0 --to v1.3.0 > relese_out.txt
npx conventional-changelog -p conventionalcommits -r 0 --from v0.0.1 --to v0.1.1 

```


```shell
npm install --save-dev semantic-release
npm i -D @semantic-release/commit-analyzer @semantic-release/release-notes-generator @semantic-release/npm @semantic-release/github
npm install @semantic-release/git @semantic-release/changelog -D

vim .releaserc
npm i -D conventional-changelog-conventionalcommits



```


## Ref

* [오케스트라 구성](https://ko.wikipedia.org/wiki/%EA%B4%80%ED%98%84%EC%95%85%EB%8B%A8)
   
  악기 순서
  ```yaml
  Violin,Viola,Cello,Bass,Contrabass,Double Bass,Flute,Oboe,Clarinet,Bassoon,Horn,Trumpet,Trombone,Tuba,Timpani,Xylophone,Marimba,Piano,Harp
  ```
  ![image.png](https://upload.wikimedia.org/wikipedia/ko/3/3f/Orchestra.jpg)