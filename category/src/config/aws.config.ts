import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  imageBucketEndpoint: process.env.ASSET_AWS_S3_ENDPOINT,
  imageAwsS3: process.env.AWS_S3_REGION,
  imageAccessKey: process.env.AWS_S3_ACCESS_KEY_ID,
  imageSecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  imageBucketName: process.env.ASSET_AWS_S3_BUCKET_NAME,
  webIdentityTokenFile: process.env.AWS_WEB_IDENTITY_TOKEN_FILE,
  imageSessionToken: process.env.AWS_SESSION_TOKEN,
}));
