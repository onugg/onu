locals {
  name                = "onu-gg-${replace(basename(path.cwd), "_", "-")}"
  
  ## GCP
  region              = "australia-southeast1"
  zone                = "australia-southeast1-a"
}

provider "google" {
  project       = local.name
  region        = local.region
  zone          = local.zone
}

# Enable google cloud APIs
resource "google_project_service" "run_api" {
  service = "run.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "artifactregistry_api" {
  service = "artifactregistry.googleapis.com"
  disable_on_destroy = true
}

resource "google_project_service" "pubsub_api" {
  service = "pubsub.googleapis.com"
  disable_on_destroy = true
}

# Artifact repository for docker containers
resource "google_artifact_registry_repository" "onu_docker_repo" {
  location      = local.region
  repository_id = "onu-docker-repo"
  description   = "onu docker containers"
  format        = "DOCKER"
}
