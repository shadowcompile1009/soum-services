import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import csv from 'csv-parser';

const awsImagesBucket = new aws.S3({
  region: process.env.IMAGES_BUCKET_REGION,
  ...(process.env.AWS_WEB_IDENTITY_TOKEN_FILE
    ? {}
    : {
        accessKeyId: process.env.PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.PUBLIC_AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.PUBLIC_AWS_TOKEN,
      }),
});

const awsInvoicesBucket = new aws.S3({
  region: process.env.INVOICES_AWS_S3_REGION,
  ...(process.env.AWS_WEB_IDENTITY_TOKEN_FILE
    ? {}
    : {
        accessKeyId: process.env.INVOICES_AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.INVOICES_AWS_S3_SECRET_ACCESS_KEY,
        sessionToken: process.env.INVOICES_AWS_S3_SESSION_TOKEN,
      }),
});

export function uploadInvoice(fileName: string, fileContent: any) {
  return new Promise((resolve, reject) => {
    awsInvoicesBucket.upload(
      {
        Bucket: process.env.INVOICES_AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: fileContent,
      },
      function (err: any, data: any) {
        if (err) {
          reject(err);
        }
        if (data) {
          resolve(data.Location);
        }
      }
    );
  });
}

export function upload(filepath: string) {
  const storage = multerS3({
    s3: awsImagesBucket,
    bucket: process.env.IMAGES_BUCKET_NAME + filepath,
    acl: 'private',
    key: function (request: any, file: any, callback: any) {
      let fileName = file.originalname as any;
      fileName = fileName.split('.');
      fileName = fileName[0];
      fileName = fileName.replace(/\s/g, '-');
      fileName = fileName + '-' + new Date().getTime();
      const extension = file.mimetype === 'text/csv' ? '.csv' : '.jpg';
      const finalFileName = `${fileName}${extension}`;
      callback(null, finalFileName);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'text/csv'
      ) {
        cb(null, true);
      } else {
        return cb(new Error('File types allowed .jpeg, .jpg .png and .csv!'));
      }
    },
  });

  return upload;
}

export function convertToCdnURL(fileName: string) {
  return `https://${process.env.CDN_PATH}/images/${fileName}`;
}

export async function readFileFromS3(
  key: string,
  path: string
): Promise<any[]> {
  try {
    const results: Array<Record<string, string>> = [];
    const params = {
      Bucket: process.env.IMAGES_BUCKET_NAME + path,
      Key: key,
    };

    const s3Stream = awsImagesBucket.getObject(params).createReadStream();

    return new Promise((resolve, reject) => {
      s3Stream
        .pipe(csv()) // Parse CSV data
        .on('data', data => results.push(data))
        .on('end', () => resolve(results))
        .on('error', err => reject(err));
    });
  } catch (error) {
    console.log('🚀 ~ readFileFromS3 ~ error:', error);
    return [];
  }
}
