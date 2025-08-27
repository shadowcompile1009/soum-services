import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import awsConfig from 'src/config/aws.config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AmazonService {
  constructor(
    @Inject(awsConfig.KEY)
    private readonly awsConfigData: ConfigType<typeof awsConfig>,
  ) {}
  async uploadImage(fileName: string, fileContent: any) {
    const credentials: any = this.awsConfigData.webIdentityTokenFile
      ? undefined
      : {
          accessKeyId: this.awsConfigData.imageAccessKey,
          secretAccessKey: this.awsConfigData.imageSecretAccessKey,
          sessionToken: this.awsConfigData.imageSessionToken,
        };
    const client = new S3Client({
      region: this.awsConfigData.imageAwsS3,
      credentials: credentials,
    });

    try {
      const result = await client.send(
        new PutObjectCommand({
          Bucket: this.awsConfigData.imageBucketName,
          Key: fileName,
          Body: fileContent,
        }),
      );
      return {
        imageLocation:
          result?.$metadata?.httpStatusCode == 200
            ? this.awsConfigData.imageBucketEndpoint + '/' + fileName
            : null,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
