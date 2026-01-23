data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

resource "aws_iam_role" "ec2" {
  name               = "${var.name}-ec2-role"
  assume_role_policy = data.aws_iam_policy_document.ec2_assume.json
}

data "aws_iam_policy_document" "ec2_assume" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role_policy_attachment" "ssm_core" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_role_policy" "ssm_read" {
  name = "${var.name}-ssm-read"
  role = aws_iam_role.ec2.id

  policy = data.aws_iam_policy_document.ssm_read.json
}

data "aws_iam_policy_document" "ssm_read" {
  statement {
    effect = "Allow"
    actions = [
      "ssm:GetParameter",
      "ssm:GetParameters",
      "ssm:GetParametersByPath"
    ]
    resources = [
      "arn:aws:ssm:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:parameter${var.ssm_parameter_prefix}/*"
    ]
  }

  statement {
    effect = "Allow"
    actions = ["kms:Decrypt"]
    resources = [
      "arn:aws:kms:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:alias/aws/ssm"
    ]
  }
}

resource "aws_iam_role_policy" "ecr_pull" {
  count = var.ecr_repository_arn == "" ? 0 : 1
  name  = "${var.name}-ecr-pull"
  role  = aws_iam_role.ec2.id

  policy = data.aws_iam_policy_document.ecr_pull[0].json
}

data "aws_iam_policy_document" "ecr_pull" {
  count = var.ecr_repository_arn == "" ? 0 : 1

  statement {
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "ecr:BatchGetImage",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchCheckLayerAvailability"
    ]
    resources = [var.ecr_repository_arn]
  }
}

resource "aws_iam_instance_profile" "ec2" {
  name = "${var.name}-ec2-profile"
  role = aws_iam_role.ec2.name
}
