terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

data "aws_availability_zones" "available" {
  state = "available"
}

locals {
  name = var.name
}

module "network" {
  source = "../../modules/network"

  name                = local.name
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs = var.public_subnet_cidrs
  public_subnet_azs   = [data.aws_availability_zones.available.names[0]]
}

module "ecr" {
  source = "../../modules/ecr"

  repository_name = var.ecr_repo_name
}

module "iam" {
  source = "../../modules/iam"

  name                 = local.name
  ssm_parameter_prefix = var.parameter_prefix
  ecr_repository_arn   = module.ecr.repository_arn
}

module "ssm" {
  source = "../../modules/ssm"

  parameter_prefix = var.parameter_prefix
}

module "s3_site" {
  source = "../../modules/s3_site"

  bucket_name = var.s3_bucket_name
}

module "cloudfront" {
  source = "../../modules/cloudfront"

  name        = local.name
  bucket_name = module.s3_site.bucket_name
}

module "ec2_api" {
  source = "../../modules/ec2_api"

  name                  = local.name
  region                = var.region
  vpc_id                = module.network.vpc_id
  public_subnet_id       = module.network.public_subnet_ids[0]
  instance_profile_name = module.iam.instance_profile_name
  ssm_parameter_prefix  = var.parameter_prefix
  api_image             = "${module.ecr.repository_url}:${var.api_image_tag}"
  instance_type         = var.instance_type
  api_port              = var.api_port
}
