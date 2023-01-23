variable aws_region {
  default = "ap-southeast-2"
}

variable environment {
  default = "test"
}

variable discord_token {
  type = string
  sensitive = true
}

variable postgres_password {
  type = string
  sensitive = true
}

variable aws_access_key {
  type = string
  sensitive = true
}

variable aws_access_secret {
  type = string
  sensitive = true
}

variable upstash_api_key {
  type = string
  sensitive = true
}

variable upstash_email {
  type = string
  sensitive = true
}

variable upstash_topics_path {
  type = string
  default = "../../../packages/kafka/topics.json"
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
  
  required_providers {

    upstash = {
      source = "upstash/upstash"
      version = "1.2.5"
    }
  }
}

provider "aws" {
  region     = var.aws_region
  access_key = var.aws_access_key
  secret_key = var.aws_access_secret
}

provider "upstash" {
  email = var.upstash_email
  api_key = var.upstash_api_key
}

data "aws_caller_identity" "current" {}

resource "upstash_kafka_cluster" "cluster" {
  cluster_name = "onu-${var.environment}-cluster"
  region = "us-east-1"
  multizone = false
}

locals {
  topics = jsondecode(file(var.upstash_topics_path))
}

resource "upstash_kafka_topic" "kafka_topic" {

  for_each = {for idx, topic in local.topics.topics: idx => topic}

  topic_name =each.value.name
  partitions = 1
  retention_time = 625135
  retention_size = 725124
  max_message_size = 829213
  cleanup_policy = "delete"

  cluster_id = resource.upstash_kafka_cluster.cluster.cluster_id
}

resource "aws_vpc" "aws_vpc" {
  cidr_block       = "10.0.0.0/16"
  enable_dns_support = true
  enable_dns_hostnames = true

  tags = {
    Name: "onu-${var.environment}-vpc"
    Environment = var.environment
  }
}

resource "aws_internet_gateway" "aws_internet_gateway" {
  vpc_id = aws_vpc.aws_vpc.id

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-internet-gateway"
  }
}

resource "aws_subnet" "aws_pub_subnet_1" {
  vpc_id = aws_vpc.aws_vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-public-subnet-1"
  }
}

resource "aws_subnet" "aws_pub_subnet_2" {
  vpc_id = aws_vpc.aws_vpc.id
  cidr_block = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-public-subnet-2"
  }
}

resource "aws_route_table" "aws_route_table" {
  vpc_id = aws_vpc.aws_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.aws_internet_gateway.id
  }

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-route-table"
  }
}

resource "aws_route_table_association" "aws_route_table_association" {
  subnet_id = aws_subnet.aws_pub_subnet_1.id
  route_table_id = aws_route_table.aws_route_table.id
}


resource "aws_security_group" "ecs_sg" {
  name = "onu-${var.environment}-ecs-sg"
  vpc_id = aws_vpc.aws_vpc.id

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 443
    to_port = 443
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 65535
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-ecs-sg"
  }
}

resource "aws_security_group" "rds_sg" {
  name = "onu-${var.environment}-rds-sg"
  vpc_id = aws_vpc.aws_vpc.id

  ingress {
    from_port = 5432
    to_port = 5432
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    security_groups = [aws_security_group.ecs_sg.id]
  }

  egress {
    from_port = 0
    to_port = 65535
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-rds-sg"
  }
}

data "aws_iam_policy_document" "ecs_agent" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ecs_agent" {
  name = "onu-${var.environment}-ecs-agent"
  assume_role_policy = data.aws_iam_policy_document.ecs_agent.json

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-ecs-agent-role"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_agent" {
  role = aws_iam_role.ecs_agent.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs_agent" {
  name = "onu-${var.environment}-ecs-agent"
  role = aws_iam_role.ecs_agent.name

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-ecs-agent-profile"
  }
}

resource "aws_launch_configuration" "ecs_launch_config" {
  name_prefix = "onu-${var.environment}-ecs-"
  image_id = "ami-02d1d818f19a85542"
  instance_type = "t2.micro"
  iam_instance_profile = aws_iam_instance_profile.ecs_agent.name
  security_groups = [aws_security_group.ecs_sg.id]
  user_data = "#!/bin/bash\necho ECS_CLUSTER=onu-${var.environment}-ecs-cluster >> /etc/ecs/ecs.config"
}

resource "aws_autoscaling_group" "failure_analysis_ecs_asg" {
  name = "onu-${var.environment}-ecs-asg"
  launch_configuration = aws_launch_configuration.ecs_launch_config.name
  vpc_zone_identifier = [aws_subnet.aws_pub_subnet_1.id]
  
  min_size = 1
  max_size = 10
  health_check_grace_period = 300
  desired_capacity = 1
  health_check_type = "EC2"
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name = "onu-${var.environment}-rds-subnet-group"
  subnet_ids = [aws_subnet.aws_pub_subnet_1.id, aws_subnet.aws_pub_subnet_2.id]

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-rds-subnet-group"
  }
}

resource "aws_db_instance" "postgres" {
  identifier = "onu-${var.environment}-rds"
  engine = "postgres"
  engine_version = "14.5"
  instance_class = "db.t3.micro"
  allocated_storage = 20
  username = "onu_admin_${var.environment}"
  password = "${var.postgres_password}"
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id, aws_security_group.ecs_sg.id]
  skip_final_snapshot = true
  publicly_accessible = true
  port = 5432

  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-rds-postgres"
  }
}

# resource "aws_ecr_repository" "ecr" {
#   name = "onu-${var.environment}-ecr-services"

#   tags = {
#     Environment = var.environment
#     Name = "onu-${var.environment}-ecr-services"
#   }
# }

resource "aws_ecs_cluster" "ecs_cluster" {
  name = "onu-${var.environment}-ecs-cluster"


  tags = {
    Environment = var.environment
    Name = "onu-${var.environment}-ecs-cluster"
  }
}

resource "aws_ecs_capacity_provider" "ecs_capacity_provider_1" {
  name = "onu-${var.environment}-ecs-capacity-provider-1"

  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.failure_analysis_ecs_asg.arn
  }
}

resource "aws_ecs_cluster_capacity_providers" "ecs_cluster" {
  cluster_name = aws_ecs_cluster.ecs_cluster.name

  capacity_providers = [aws_ecs_capacity_provider.ecs_capacity_provider_1.name]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider_1.name
  }
}
 
module "discord-bot-service" {
  source = "../../modules/service"

  aws_access_key = var.aws_access_key
  aws_access_secret = var.aws_access_secret
  aws_region = var.aws_region
  service_name = "discord-bot"
  ecs_cluster_id = aws_ecs_cluster.ecs_cluster.id
  environment = var.environment
  task_definition = jsonencode([
    {
      name      = "discord-bot"
      image     = "[[IMAGE_NAME]]" # This is replaced inside the module with the ECR image name
      cpu       = 1
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
      environment = [
        {
          name: "DISCORD_TOKEN",
          value: var.discord_token
        }
      ]
    }
  ])
}

# resource "aws_ecs_task_definition" "discord-bot-service-task-definition" {
#   family = "discord-bot"
#   container_definitions = jsonencode([
#     {
#       name      = var.service_name
#       image     = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/onu-${var.environment}-${service_name}-ecr:latest"
#       cpu       = 1
#       memory    = 512
#       essential = true
#       portMappings = [
#         {
#           containerPort = 80
#           hostPort      = 80
#         }
#       ]
#       environment = [
#         {
#           name: "DISCORD_TOKEN",
#           value: var.discord_token
#         }
#       ]
#     }
#   ])
# }

# resource "aws_ecs_service" "ecs_service-discord-bot" {
#   name = "discord-bot"
#   cluster = aws_ecs_cluster.ecs_cluster.id
#   task_definition = aws_ecs_task_definition.discord-bot-service-task-definition.arn
#   desired_count = 1

#   tags = {
#     Environment = var.environment
#     Name = "onu-${var.environment}-ecs_service-discord-bot"
#   }
# }

