# node-lambda-twilio

## Description

This is a simple AWS CloudFormation template that creates an Lambda Function,
an API Gateway and a DynamoDB table. All of the contents of the Twilio POST
request are stored in the DynamoDB table and responds to the SMS sender with
the message "You sent the message: {SMS Message}".

## Deploying

To deploy this function, you will need to have an AWS Account and configured
correctly on your computer. You will also have an S3 bucket that can be used
for deployment.

### Step 1 - Package the CloudFormation Template

This uses the [AWS CloudFormation Package Command](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/package.html) to zip the contents of
this directory, upload to S3, and modify the template.json file and saves the
output as the file "packaged-template.json".

```
aws cloudformation package \
    --template-file template.json \
    --s3-bucket S3_Bucket_Name \
    --output-template-file packaged-template.json \
    --use-json
```

### Step 2 - Deploy the CloudFormation Template

This uses the [AWS CloudFormation Deploy Function](https://docs.aws.amazon.com/cli/latest/reference/cloudformation/deploy/index.html) to create or update a CloudFormation stack.

```
aws cloudformation deploy \
    --template-file packaged-template.json \
    --stack-name your-stackname-here \
    --region us-west-2 \
    --capabilities CAPABILITY_IAM
```

### Step 3 - Update Twilio

Once the CloudForation Template has been deployed, an API Gateway will be 
created and deployed. Find the URL in the [API Gateway Console](https://us-west-2.console.aws.amazon.com/apigateway/home) and update your webhook settings in the [Twilio Phone Number
Dashboard](https://www.twilio.com/console/phone-numbers/incoming).

## More Information

For more detailed instructions, please see the [detailed blog post](https://markslosarek.com/aws-cloudformation-lambda-node-js-twilio-function-part-1/) on what this is
and how it works.
