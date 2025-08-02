#!/bin/bash

# AWS Deployment Script for React Frontend
# This script builds and deploys the React app to AWS S3 and CloudFront

set -e

# Configuration
ENV=${1:-production}
BUCKET_NAME=${VITE_AWS_S3_BUCKET}
CLOUDFRONT_DISTRIBUTION=${VITE_AWS_CLOUDFRONT_DISTRIBUTION}
AWS_REGION=${VITE_AWS_REGION:-us-east-1}

echo "🚀 Starting deployment for environment: $ENV"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install AWS CLI first."
    exit 1
fi

# Check if environment variables are set
if [[ -z "$BUCKET_NAME" || -z "$CLOUDFRONT_DISTRIBUTION" ]]; then
    echo "❌ Missing required environment variables:"
    echo "   VITE_AWS_S3_BUCKET: $BUCKET_NAME"
    echo "   VITE_AWS_CLOUDFRONT_DISTRIBUTION: $CLOUDFRONT_DISTRIBUTION"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting and type checking
echo "🔍 Running linting and type checking..."
npm run lint
npm run type-check

# Run tests
echo "🧪 Running tests..."
npm run test:ci

# Build the application
echo "🏗️  Building application for $ENV..."
if [ "$ENV" = "production" ]; then
    npm run build
else
    npm run build:$ENV
fi

# Deploy to S3
echo "☁️  Deploying to S3 bucket: $BUCKET_NAME"
aws s3 sync dist/ s3://$BUCKET_NAME --delete --region $AWS_REGION

# Set proper cache headers
echo "🔧 Setting cache headers..."
aws s3 cp s3://$BUCKET_NAME/index.html s3://$BUCKET_NAME/index.html \
    --metadata-directive REPLACE \
    --cache-control "public, max-age=0, must-revalidate" \
    --region $AWS_REGION

aws s3 cp s3://$BUCKET_NAME/assets/ s3://$BUCKET_NAME/assets/ \
    --recursive \
    --metadata-directive REPLACE \
    --cache-control "public, max-age=31536000, immutable" \
    --region $AWS_REGION

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
    --distribution-id $CLOUDFRONT_DISTRIBUTION \
    --paths "/*" \
    --region $AWS_REGION

echo "✅ Deployment completed successfully!"
echo "🌐 Your application is available at: https://$(aws cloudfront get-distribution --id $CLOUDFRONT_DISTRIBUTION --query 'Distribution.DomainName' --output text --region $AWS_REGION)"