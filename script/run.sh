


# Test Docker run
docker run -itd -p 14000:14000 --name jekyll -v /home/codex/git/personal/muse_profile:/srv/jekyll --entrypoint /bin/sh muse-profile:v0.2


gem install jekyll bundler
bundle install
bundle exec jekyll clean
bundle exec jekyll build
bundle exec jekyll serve --config _config.yml --host 0.0.0.0 --port 14000 --force_polling --livereload

# For auto reload _config.yml
echo "_config.yml" | entr -r bundle exec jekyll serve --config _config.yml --host 0.0.0.0 --port 14000 --force_polling --livereload
jekyll serve --host 0.0.0.0 --port 14000 --force_polling