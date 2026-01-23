variable "name" {
  type = string
}

variable "region" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_id" {
  type = string
}

variable "instance_profile_name" {
  type = string
}

variable "ssm_parameter_prefix" {
  type = string
}

variable "api_image" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "api_port" {
  type    = number
  default = 4000
}
