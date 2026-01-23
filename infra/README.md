# MERN AWS Free Tier Infra

This Terraform config provisions a low-cost AWS setup for testing:
- S3 + CloudFront (default CF domain, HTTPS) for web
- EC2 t3.micro + Elastic IP (Docker + Compose) for API
- MongoDB Atlas (external)
- SSM Parameter Store for secrets
- SSM Session Manager for access (no SSH)

## Prereqs
- Terraform >= 1.6
- AWS CLI configured with credentials
- Docker installed locally for building/pushing images

## Quick Start
```bash
cd infra/envs/dev
terraform init
terraform plan -var-file=terraform.tfvars.example
terraform apply -var-file=terraform.tfvars.example
```

## Set real SSM secret values
Terraform creates placeholder SecureString values. Replace them with real values:
```bash
aws ssm put-parameter --name "/mern/dev/MONGO_URI" --value "<atlas-uri>" --type SecureString --overwrite
aws ssm put-parameter --name "/mern/dev/JWT_ACCESS_SECRET" --value "<access-secret>" --type SecureString --overwrite
aws ssm put-parameter --name "/mern/dev/JWT_REFRESH_SECRET" --value "<refresh-secret>" --type SecureString --overwrite
```

## Build and push API image to ECR
```bash
cd d:/mern-social-rbac-app
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push (adjust Dockerfile path if needed)
docker build -f Dockerfile.api -t mern-api:latest .
docker tag mern-api:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/mern-api:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/mern-api:latest
```

## Deploy web assets to S3 and invalidate CloudFront
```bash
# Build your web app (adjust command/output path)
cd d:/mern-social-rbac-app
pnpm --filter web build

aws s3 sync apps/web/dist s3://<your-unique-bucket-name> --delete
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
```

## Access the EC2 instance via Session Manager
```bash
aws ssm start-session --target <instance-id>
```

## Rollout plan (in-place)
1. `terraform apply` to create infra.
2. Set real SSM parameters (above).
3. Push API image to ECR.
4. SSM Session Manager to instance (optional) to verify containers.
5. Deploy web assets to S3, then invalidate CloudFront.

## Smoke test
- API health: `http://<elastic-ip>/health`
- API base: `http://<elastic-ip>/api/`

## Outputs
- `web_url` (CloudFront)
- `api_url` (Elastic IP)
- `ecr_repo_url`
