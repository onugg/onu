variable aws_access_key {
  type = string
  sensitive = true
}

variable aws_access_secret {
  type = string
  sensitive = true
}

variable aws_region {
  default = "ap-southeast-2"
}

variable service_name {
  type = string
}

variable ecs_cluster_id {
  type = string
}

variable task_definition {
  type = string
}

variable environment {
  type = string
}

terraform {
  cloud {
    organization = "onu"
    ## Required for Terraform Enterprise; Defaults to app.terraform.io for Terraform Cloud
    hostname = "app.terraform.io"

    workspaces {
      tags = ["onu-test"]
    }
  }
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_access_secret
}

# each image gets one ECR repository

resource "aws_ecr_repository" "ecr" {
  name = "onu-${var.environment}-${var.service_name}-ecr"

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-${var.service_name}-ecr"
  }
}

data "aws_caller_identity" "current" {}

locals {
  image_name = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/onu-${var.environment}-${var.service_name}-ecr:latest"
}

resource "aws_ecs_task_definition" "current" {
  family = var.service_name
  container_definitions = replace(var.task_definition, "[[IMAGE_NAME]]", local.image_name)
}

resource "aws_ecs_service" "ecs_service-discord-bot" {
  name = var.service_name
  cluster = var.ecs_cluster_id
  task_definition = aws_ecs_task_definition.current.arn
  desired_count = 1

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-${var.service_name}-ecs-service"
  }
}

output "ecr-repository-name" {
  value = aws_ecr_repository.ecr.name
}

output "image_name" {
  value = local.image_name
}