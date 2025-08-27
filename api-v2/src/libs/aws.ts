import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export class AWSService {
  constructor() {}
  private static imageAWSCDN = process.env.IMAGES_AWS_S3_ENDPOINT_CDN;

  public static async createPresignedUrl(
    userId: string,
    dmOrderId: string,
    count: number,
    extensions: string
  ) {
    try {
      const preSignedUrls = [];
      const extensionsArr = extensions.split(',');
      for (let i = 0; i < count; i++) {
        const folderPath = `assets/${userId}/dmorders/${dmOrderId}`;
        const fileName = `dispute-${uuidv4()}.${extensionsArr[i]}`;
        preSignedUrls.push(
          await AWSService.generateUploadPresignedUrl(folderPath, fileName)
        );
      }
      return preSignedUrls;
    } catch (error) {
      return null;
    }
  }

  private static async generateUploadPresignedUrl(
    folderPath: string,
    fileName: string
  ) {
    const credentials: any = process.env.AWS_WEB_IDENTITY_TOKEN_FILE
      ? undefined
      : {
          accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
          sessionToken: process.env.AWS_SESSION_TOKEN,
        };
    const client = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: credentials,
    });
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.ASSET_AWS_S3_BUCKET_NAME,
        Key: `${folderPath}/${fileName}`,
      });
      const url = await getSignedUrl(client, command, {
        expiresIn: 60 * 10,
      }); // 10 mins
      return {
        name: fileName,
        status: false,
        url,
        imageUrl: `${AWSService.imageAWSCDN}/${folderPath}/${fileName}`,
      };
    } catch (error) {
      return error;
    }
  }

  // const folderExists = await checkFolderExists(folderPath, config.aws.bucket);
}
