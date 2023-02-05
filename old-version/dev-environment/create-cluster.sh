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

# set a variable called project using the config.json file. The project is in gcloud.projectId path
projectid=$(jq -r '.gcloud.projectId' config.json)

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


gcloud iam service-accounts keys create --iam-account k8s-registry-account@$projectid.iam.gserviceaccount.com key.json

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

echo "Done"