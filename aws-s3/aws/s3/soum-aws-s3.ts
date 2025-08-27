import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export class SoumAwsS3 {
  static async createPresignedUrl(bucket: Bucket, fileName: string) {
    try {
      const credentials: any = bucket.webIdentityTokenFile
        ? undefined
        : {
            accessKeyId: bucket.accessKey,
            secretAccessKey: bucket.secretAccessKey,
            sessionToken: bucket.sessionToken,
          };
      const client = new S3Client({
        region: bucket.awsS3,
        credentials: credentials,
      });
      const command = new PutObjectCommand({
        Bucket: bucket.bucketName,
        Key: fileName,
      });
      return getSignedUrl(client, command, { expiresIn: 60 * 10 }); // 10 mins
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async getPresignedUrl(
    createPresignedUrlreqDto: CreatePresignedUrlreqDto
  ) {
    const urls = [];
    let basePath = "";
    switch (createPresignedUrlreqDto.imageModule) {
      case ImageModuleEnum.IMAGE_SEC_ICON:
        basePath = "image-sections-icons";
        break;
      case ImageModuleEnum.PRODUCT_IMAGE:
        basePath = `assets/${createPresignedUrlreqDto.user.id}/listings/${createPresignedUrlreqDto.product.id}`;
        break;
      case ImageModuleEnum.USER_PROFILE:
        basePath = `assets/${createPresignedUrlreqDto.user.id}/profile`;
        break;
      case ImageModuleEnum.CONDITION_ICON:
        basePath = `assets/conditions`;
        break;
      case ImageModuleEnum.CATEGORY_ICON:
        basePath = `assets/category`;
        break;
      case ImageModuleEnum.STORIES_SECTION:
        basePath = `assets/stories-section`;
        break;
      case ImageModuleEnum.PRODUCT_INSPECTION:
        basePath = `assets/${createPresignedUrlreqDto.user.id}/listings/${createPresignedUrlreqDto.product.id}/inspection`;
        break;
    }
    for (
      let index = 0;
      index < createPresignedUrlreqDto?.fileReqSummary?.count || 0;
      index++
    ) {
      const path = `${basePath}/${uuidv4()}.${
        createPresignedUrlreqDto?.fileReqSummary?.fileExtension
      }`;
      const url = await this.createPresignedUrl(
        createPresignedUrlreqDto.bucket,
        path
      );
      if (url)
        urls.push({
          url,
          path: path,
          cdn: createPresignedUrlreqDto.bucket.bucketEndpointCDN,
        });
    }
    return urls;
  }
}

export interface CreatePresignedUrlreqDto {
  user: User;
  product: Product;
  bucket: Bucket;
  imageModule: ImageModuleEnum;
  fileReqSummary: FileReqSummary;
}
export interface User {
  id: string;
}
export interface Product {
  id: string;
}

export interface Bucket {
  awsS3: string;
  webIdentityTokenFile: string;
  accessKey: string;
  secretAccessKey: string;
  sessionToken: string;
  bucketName: string;
  bucketEndpointCDN: any;
}
export interface FileReqSummary {
  count: number;
  fileExtension: string;
}
enum ImageModuleEnum {
  IMAGE_SEC_ICON = "imageSecIcon",
  CONDITION_ICON = "conditionIcon",
  CATEGORY_ICON = "categoryIcon",
  PRODUCT_IMAGE = "productImage",
  USER_PROFILE = "userProfile",
  STORIES_SECTION = "storiesSection",
  PRODUCT_INSPECTION = "productInspection",
}
