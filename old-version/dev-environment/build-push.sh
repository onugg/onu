projectid=$(jq -r '.gcloud.projectId' config.json)

(cd .. && docker build -t gcr.io/$projectid/discord-bot:latest . -f Dockerfile.discord-bot)
#(cd .. && docker push gcr.io/$projectid/discord-bot:latest)