output "ecr-repository-name" {
  description = "Name of the ECR repository"
  value       = aws_ecr_repository.ecr.name
}

output "image-name" {
  description = "Name of the image"
  value       = local.image-name
}