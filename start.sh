#!/usr/bin/env bash
docker build -t rifflearning:riff-server .
docker run --env-file env_template --mount type=bind,source="$(pwd)",target=/app rifflearning:riff-server
