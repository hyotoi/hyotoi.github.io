#!/bin/bash

THEME_DIR="_themes/minimal-mistakes"
TARGET_DIRS=("_layouts" "_includes" "_sass" "assets")


for dir in "${TARGET_DIRS[@]}"; do
  if [ -d "$THEME_DIR/$dir" ]; then
    echo "$THEME_DIR/$dir -> ./$dir"
    cp -r "$THEME_DIR/$dir" ./
  else
    echo "Dir Not Exist: $THEME_DIR/$dir"
  fi
done

echo "Done"