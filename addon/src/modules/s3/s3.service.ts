import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';

const awsImagesBucket = new S3Client({
  region: process.env.IMAGES_BUCKET_REGION,
  credentials: process.env.AWS_WEB_IDENTITY_TOKEN_FILE
    ? undefined
    : {
        accessKeyId: process.env.PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.PUBLIC_AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.PUBLIC_AWS_TOKEN,
      },
});

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  async upload(file: Express.Multer.File, filepath: string): Promise<string> {
    try {
      let fileName = file.originalname.split('.')[0].replace(/\s/g, '-');
      fileName = `${fileName}-${Date.now()}.jpg`;

      const key = `${filepath}/${fileName}`;

      const uploadParams = {
        Bucket: process.env.IMAGES_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ACL: 'private' as ObjectCannedACL,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(uploadParams);
      await awsImagesBucket.send(command);

      const filePath = `${process.env.IMAGES_AWS_S3_ENDPOINT_CDN}/${filepath}/${fileName}`;

      return filePath;
    } catch (err) {
      this.logger.error('Experienced an error uploading file to S3', err);
      return err;
    }
  }
}
