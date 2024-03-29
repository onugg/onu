# Prerequisites:
# - Install the Google Cloud CLI
# - Create a gcloud project

# This script will
# 2 - Enable the IAM and Container APIs on gcloud
# 3 - Create a service account on gcloud
# 4 - Grant the service account access to all container repositories for the project
# 5 - Export the secret key for the service account to a file
# 5 - Create a knative cluster in kind using the knative quickstart script
# 6 - Export the service account

projectid=$(cat config.yaml | yq | jq -r '.gcloud.project_id')

# Check if a google cloud project exists with the google cloud cli
if gcloud projects describe $projectid > /dev/null 2>&1; then
    echo "Project $projectid exists"
else
    echo "Project $projectid does not exist"
    exit 1
fi

gcloud config set project $projectid
echo "Context set to project $projectid in gcloud cli"

# check if containerregistry service enabled in gcloud
if gcloud services list --filter=containerregistry.googleapis.com | grep containerregistry.googleapis.com > /dev/null 2>&1; then
    echo "Container registry API enabled"
else
    echo "Container registry API not enabled. Enabling..."
    gcloud services enable containerregistry.googleapis.com
    echo "Enabled container registry API"
fi

# check if iam service enabled in gcloud
if gcloud services list --filter=iam.googleapis.com | grep iam.googleapis.com > /dev/null 2>&1; then
    echo "IAM API enabled"
else
    echo "IAM API not enabled. Enabling..."
    gcloud services enable iam.googleapis.com
    echo "Enabled IAM API"
fi

# check if k8s-registry-account service account already exists
if gcloud iam service-accounts list --filter="name:k8s-registry-account" | grep k8s-registry-account > /dev/null 2>&1; then
    echo "Service account k8s-registry-account already exists"
else
    echo "Service account k8s-registry-account does not exist. Creating..."
    gcloud iam service-accounts create k8s-registry-account \
      --description="Pull containers from registry to k8s" \
      --display-name=k8s-registry-account
    echo "Created service account k8s-registry-account"
fi

gcloud projects add-iam-policy-binding $projectid \
    --member=serviceAccount:k8s-registry-account@$projectid.iam.gserviceaccount.com \
    --role=roles/storage.admin

# check if key.json file already exists
if [ -f ./key.json ]; then
    echo "key.json already exists"
    echo "Note: if you need a new key.json please delete the exisiting key.json file"
else
    echo "key.json does not exist. Creating..."
    gcloud iam service-accounts keys create --iam-account k8s-registry-account@$projectid.iam.gserviceaccount.com key.json
    echo "Created key.json"
fi

# create knative cluster in kind

# check if cluster knative exists using command kind get clusters
if kind get clusters | grep knative > /dev/null 2>&1; then
    echo "Cluster knative already exists"
else
    echo "Cluster knative does not exist. Creating..."
    kn quickstart kind
    echo "Created cluster knative"
fi

# check if secret gcr-docker-registry already exists with kubectl

if kubectl get secret -o name | grep secret/gcr-docker-registry > /dev/null 2>&1; then
    echo "Secret gcr-docker-registry already exists"
else
    echo "Secret gcr-docker-registry does not exist. Creating..."
    kubectl create secret docker-registry gcr-docker-registry \
      --docker-server gcr.io \
      --docker-username _json_key \
      --docker-email not@val.id \
      --docker-password="$(cat ./key.json)"
fi

# create trigger proxies to local machine
#ytt -f ./k8s-yaml/kn-quest-broker-trigger-localhost-discord-bot.yaml -f config.yaml | kubectl apply -f -
#ytt -f ./k8s-yaml/kn-example-broker-trigger-localhost-discord-bot.yaml.yaml -f config.yaml | kubectl apply -f -

for file in $(find ./k8s-yaml -type f); do
    # create a variable with the file name without the extension
    filename=$(basename -- "$file")
    filename="${filename%.*}"
    ytt -f $file -f config.yaml | kubectl apply -f -
done

# create dashboard
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml

kubectl apply -f ./k8s-yaml/dashboard-service-account.yaml

echo "Creating bearer token to access dashboard"
kubectl -n kubernetes-dashboard create token admin-user

echo "Dashboard available at: http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/."
kubectl proxy


echo "Done"
