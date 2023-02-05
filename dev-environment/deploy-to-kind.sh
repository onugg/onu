projectid=$(cat config.yaml | yq | jq -r '.gcloud.project_id')

(cd ../monorepo && docker build -t gcr.io/$projectid/discord-bot:latest . -f Dockerfile.discord-bot)
(cd ../monorepo && docker push gcr.io/$projectid/discord-bot:latest)