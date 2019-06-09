## WeatherNote 🌩
AWS Lambda function that sends daily weather info from the DarkSky API as an email via AWS SES, in one short JS file

### Setup 🛠
- [Add this function to AWS Lambda](https://aws.amazon.com/lambda/)
- [Add Permision for SES to a IAM Role assigned to the Lambda Function](https://docs.aws.amazon.com/lambda/latest/dg/lambda-permissions.html)
- [Verify Email Addresses used](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses-procedure.html)
  - FROM address needs to be verified
  - TO addresses need to be verified, unless AWS account is not in SES Sandbox
- [Get a DarkSky API](https://darksky.net/dev/register)
- [Schedule Lambda Function with CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/RunLambdaSchedule.html)
