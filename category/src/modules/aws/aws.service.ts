import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import awsConfig from '@src/config/aws.config';
import { SoumAwsS3 } from 'soum-lib/dist';


@Injectable()
export class AmazonService {
  constructor(
    @Inject(awsConfig.KEY)
    private readonly awsConfigData: ConfigType<typeof awsConfig>,
  ) {}

  async getPresignedUrl(
    data: {
      count: number;
      imageModule: ImageModuleEnum;
      fileExtension: string;
    },
    userId: string,
  ) {
    return SoumAwsS3.getPresignedUrl({
      bucket: {
        accessKey: this.awsConfigData.imageAccessKey,
        awsS3: this.awsConfigData.imageAwsS3,
        bucketEndpointCDN: this.awsConfigData.imageBucketEndpoint,
        bucketName: this.awsConfigData.imageBucketName,
        secretAccessKey: this.awsConfigData.imageSecretAccessKey,
        sessionToken: this.awsConfigData.imageSessionToken,
        webIdentityTokenFile: this.awsConfigData.webIdentityTokenFile,
      },
      fileReqSummary: {
        count: data.count,
        fileExtension: data.fileExtension,
      },
      imageModule: data.imageModule,
      product: null,
      user: {
        id: userId,
      },
    });
  }
}
