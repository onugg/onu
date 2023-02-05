# Onu Dev Environment

## Installation

1. Install apache Kafka
2. Install docker
3. Install kind
4. Install postgres
5. Install gcloud plugin
6. Install kubectl

## Glcoud
1. Log in
```
gcloud auth login
```
2. Create a project
```
gcloud projects create {my-project-name}
```
3. Set the project
```
gcloud config set project {my-project-name}
```
4. *Or check if project set correctly*
```
gcloud config get project
```
5. Enable the container registry api
```
gcloud services enable containerregistry.googleapis.com
```
6. Enable the IAM api
```
gcloud services enable iam.googleapis.com
```
7. create a services account
```
gcloud iam service-accounts create k8s-registry-account \
    --description="Pull containers from registry to k8s" \
    --display-name=k8s-registry-account
```
8. Grant the service account the ability to pull images from the container registry
```
gcloud projects add-iam-policy-binding {my-project-name} \
    --member=serviceAccount:k8s-registry-account@{my-project-name}.iam.gserviceaccount.com \
    --role=roles/storage.admin
```
9. Get the email of the service account
```
gcloud iam service-accounts list
```
10. download the service account secrets json
```
gcloud iam service-accounts keys create --iam-account {service-account-email} key.json
```

### Create k8s server using kind
1. install the knative cli
```
brew install knative/client/kn
```
2. install the knative quickstart plugin
```
brew install knative-sandbox/kn-plugins/quickstart
```
3. Create the cluster
```
kn quickstart kind
```
5. Give k8s access to the container registry on GCP using the key.json file
```
kubectl create secret docker-registry gcr-docker-registry \
  --docker-server gcr.io \
  --docker-username _json_key \
  --docker-email not@val.id \
  --docker-password="$(cat ./key.json)"
```