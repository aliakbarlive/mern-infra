output "elastic_ip" {
  value = aws_eip.api.public_ip
}

output "instance_id" {
  value = aws_instance.api.id
}

output "api_base_url" {
  value = "http://${aws_eip.api.public_ip}"
}
