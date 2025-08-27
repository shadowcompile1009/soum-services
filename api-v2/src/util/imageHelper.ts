import logger from './logger';

export const mappingImagesRequest = (
  req: any,
  isUsingLegacyUpload: boolean
) => {
  try {
    let fileNameArr: string[] = [];
    if (!isUsingLegacyUpload) {
      return [];
    }
    if (
      (req.files &&
        req.files.product_images &&
        req.files.product_images.length > 0) ||
      (req.files.new_images && req.files.new_images.length > 0)
    ) {
      const files = req.files.product_images || req?.files?.new_images;

      if (files.length > 0) {
        for (const file of files) {
          let fileUrl = file?.key;

          if (fileUrl) {
            fileUrl =
              process.env.IMAGES_AWS_S3_ENDPOINT_CDN +
              '/' +
              file.bucket.split('/')[1] +
              '/' +
              fileUrl;
            fileNameArr.push(fileUrl);
          }
        }
      }
    }
    const product_images_url: string[] = req.body?.product_images_url || [];

    if (product_images_url.length > 0) {
      fileNameArr = fileNameArr.concat(product_images_url);
    }
    return fileNameArr;
  } catch (exception) {
    logger.error(exception);
  }
};
