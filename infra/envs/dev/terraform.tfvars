region         = "us-east-1"
name           = "mern-dev"
parameter_prefix = "/mern/dev"
ecr_repo_name  = "mern-api"
api_image_tag  = "latest"
instance_type  = "t3.micro"
api_port       = 4000
vpc_cidr       = "10.20.0.0/16"
public_subnet_cidrs = ["10.20.1.0/24"]

# Must be globally unique
s3_bucket_name = "your-unique-bucket-name"
