variable "name" {
  type = string
}

variable "ssm_parameter_prefix" {
  type = string
}

variable "ecr_repository_arn" {
  type    = string
  default = ""
}
