output "web_url" {
  value = "https://${module.cloudfront.cloudfront_domain_name}"
}

output "api_url" {
  value = module.ec2_api.api_base_url
}

output "ecr_repo_url" {
  value = module.ecr.repository_url
}

output "elastic_ip" {
  value = module.ec2_api.elastic_ip
}
