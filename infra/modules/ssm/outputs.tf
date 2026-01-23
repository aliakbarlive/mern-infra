output "mongo_uri_name" {
  value = aws_ssm_parameter.mongo_uri.name
}

output "jwt_access_secret_name" {
  value = aws_ssm_parameter.jwt_access.name
}

output "jwt_refresh_secret_name" {
  value = aws_ssm_parameter.jwt_refresh.name
}

output "mongo_uri_arn" {
  value = aws_ssm_parameter.mongo_uri.arn
}

output "jwt_access_secret_arn" {
  value = aws_ssm_parameter.jwt_access.arn
}

output "jwt_refresh_secret_arn" {
  value = aws_ssm_parameter.jwt_refresh.arn
}
