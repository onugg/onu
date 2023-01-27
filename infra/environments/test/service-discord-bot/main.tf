locals {
  service-name = "discord-bot"
  image-name = "${aws_ecr_repository.ecr.repository_url}:latest"
}

resource "aws_cloudwatch_log_group" "this" {
  name_prefix       = "${local.service-name}-"
  retention_in_days = 1
}

# module "ecr" {
#   source = "../../../modules/service-ecr"
  
#   service-name = local.service-name
# }

resource "aws_ecr_repository" "ecr" {
  name = local.service-name
}


resource "aws_ecs_task_definition" "this" {
  family = local.service-name

  container_definitions = <<EOF
[
  {
    "name": "${local.service-name}",
    "image": "${local.image-name}",
    "cpu": 0,
    "memory": 128,
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-region": "eu-west-1",
        "awslogs-group": "${aws_cloudwatch_log_group.this.name}",
        "awslogs-stream-prefix": "ec2"
      }
    }
  }
]
EOF
}

resource "aws_ecs_service" "this" {
  name            = local.service-name
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.this.arn

  desired_count = 1

  deployment_maximum_percent         = 100
  deployment_minimum_healthy_percent = 0
}