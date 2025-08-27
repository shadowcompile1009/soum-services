import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import awsConfig from '@src/config/aws.config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ImageModule } from './enums/imageModules.enum';
import { SoumAwsS3 } from 'soum-libs/dist';


@Injectable()
export class AmazonService {
  constructor(
    @Inject(awsConfig.KEY)
    private readonly awsConfigData: ConfigType<typeof awsConfig>,
  ) {}

  async uploadFile(fileName: string, fileContent: any) {
    const credentials: any = this.awsConfigData.webIdentityTokenFile
      ? undefined
      : {
          accessKeyId: this.awsConfigData.fileAccessKey,
          secretAccessKey: this.awsConfigData.fileSecretAccessKey,
          sessionToken: this.awsConfigData.fileSessionToken,
        };
    const client = new S3Client({
      region: this.awsConfigData.imageAwsS3,
      credentials: credentials,
    });

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: this.awsConfigData.fileBucketName,
          Key: fileName,
          Body: fileContent,
        }),
      );
    } catch (e) {
      console.log(e);
    }
  }

  async getFile(fileName: string) {
    const credentials: any = this.awsConfigData.webIdentityTokenFile
      ? undefined
      : {
          accessKeyId: this.awsConfigData.fileAccessKey,
          secretAccessKey: this.awsConfigData.fileSecretAccessKey,
          sessionToken: this.awsConfigData.fileSessionToken,
        };
    const client = new S3Client({
      region: this.awsConfigData.fileAwsS3,
      credentials: credentials,
    });

    try {
      const result = await client.send(
        new GetObjectCommand({
          Bucket: this.awsConfigData.fileBucketName,
          Key: fileName,
        }),
      );
      return result?.Body?.transformToString() || null;
    } catch (e) {
      return null;
    }
  }

  async createPresignedUrl(fileName: string) {
    try {
      const credentials: any = this.awsConfigData.webIdentityTokenFile
        ? undefined
        : {
            accessKeyId: this.awsConfigData.fileAccessKey,
            secretAccessKey: this.awsConfigData.fileSecretAccessKey,
            sessionToken: this.awsConfigData.fileSessionToken,
          };
      const client = new S3Client({
        region: this.awsConfigData.fileAwsS3,
        credentials: credentials,
      });
      const command = new PutObjectCommand({
        Bucket: this.awsConfigData.fileBucketName,
        Key: fileName,
      });
      return getSignedUrl(client, command, { expiresIn: 60 * 10 }); // 10 mins
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPresignedUrl(
    data: {
      count: number;
      imageModule: ImageModule;
      fileExtension: string;
    },
    userId: string,
    productId: string = 'all',
  ) {
    return SoumAwsS3.getPresignedUrl({
      bucket: {
        accessKey: this.awsConfigData.fileAccessKey,
        awsS3: this.awsConfigData.imageAwsS3,
        bucketEndpointCDN: this.awsConfigData.imageBucketEndpoint,
        bucketName: this.awsConfigData.imageBucketName,
        secretAccessKey: this.awsConfigData.fileSecretAccessKey,
        sessionToken: this.awsConfigData.fileSessionToken,
        webIdentityTokenFile: this.awsConfigData.webIdentityTokenFile,
      },
      fileReqSummary: {
        count: data.count,
        fileExtension: data.fileExtension,
      },
      imageModule: data.imageModule,
      product: {
        id : productId,
      },
      user: {
        id: userId,
      },
    });
  }
}