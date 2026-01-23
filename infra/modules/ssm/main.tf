resource "aws_ssm_parameter" "mongo_uri" {
  name  = "${var.parameter_prefix}/MONGO_URI"
  type  = "SecureString"
  value = var.placeholder_value

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "jwt_access" {
  name  = "${var.parameter_prefix}/JWT_ACCESS_SECRET"
  type  = "SecureString"
  value = var.placeholder_value

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "jwt_refresh" {
  name  = "${var.parameter_prefix}/JWT_REFRESH_SECRET"
  type  = "SecureString"
  value = var.placeholder_value

  lifecycle {
    ignore_changes = [value]
  }
}
