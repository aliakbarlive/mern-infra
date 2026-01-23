variable "region" {
  type    = string
  default = "us-east-1"
}

variable "name" {
  type    = string
  default = "mern-dev"
}

variable "parameter_prefix" {
  type    = string
  default = "/mern/dev"
}

variable "ecr_repo_name" {
  type    = string
  default = "mern-api"
}

variable "s3_bucket_name" {
  type = string
}

variable "api_image_tag" {
  type    = string
  default = "latest"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "api_port" {
  type    = number
  default = 4000
}

variable "vpc_cidr" {
  type    = string
  default = "10.20.0.0/16"
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.20.1.0/24"]
}
