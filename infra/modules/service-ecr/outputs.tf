output "ecr_id" {
  description = "ID of the ECR repository"
  value       = try(module.ecr.ecr_id, null)
}