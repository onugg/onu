output "discord-bot-aws-ecr-repository-name" {
  value = module.discord-bot-service.ecr-repository-name
}

output "discord-bot-image-name" {
  value = module.discord-bot-service.image_name
}