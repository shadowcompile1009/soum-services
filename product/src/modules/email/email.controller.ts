import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { EmployerType } from './constants/employerType.enum';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { MESSAGE } from './constants/message';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Post('finance')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async sendEmail(
    @Body() payload: any,
    @Req() request: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const allowedExtensions = ['pdf', 'jpeg', 'png', 'jpg'];

    const userId = request.user.userId;

    const isValidExtension = (filename: string): boolean => {
      const extension = filename.split('.').pop()?.toLowerCase();
      return extension ? allowedExtensions.includes(extension) : false;
    };

    const invalidFiles = files.filter(
      (file) => !isValidExtension(file.originalname),
    );

    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles
        .map((file) => file.originalname)
        .join(', ');

      return {
        code: 400,
        message: `The following files have invalid extensions: ${invalidFileNames}. Only PDF, JPEG, PNG, and IPG files are allowed.`,
      };
    }

    let attachments = [];

    const commonAttachments = files.filter(
      (file) =>
        (file.fieldname === 'nationId' || file.fieldname === 'driverLicense') &&
        isValidExtension(file.originalname),
    );

    let specificAttachments = [];
    switch (payload.empType) {
      case EmployerType.PRIVATE:
        specificAttachments = files.filter(
          (file) =>
            (file.fieldname === 'proofOfSalary' ||
              file.fieldname === 'proofOfInsurance' ||
              file.fieldname === 'bankStatement') &&
            isValidExtension(file.originalname),
        );
        break;

      case EmployerType.GOVERNMENT:
        specificAttachments = files.filter(
          (file) =>
            (file.fieldname === 'proofOfSalary' ||
              file.fieldname === 'bankStatement') &&
            isValidExtension(file.originalname),
        );
        break;

      case EmployerType.RETIRED:
        specificAttachments = files.filter(
          (file) =>
            file.fieldname === 'pensionCertificate' &&
            isValidExtension(file.originalname),
        );
        break;

      default:
        specificAttachments = [];
    }

    attachments = [...commonAttachments, ...specificAttachments];

    if (attachments.length === 0) {
      return {
        code: 400,
        message: MESSAGE.ATTACHMENT_IS_EMPTY,
      };
    }

    return await this.emailService.sendEmailFinance(
      attachments,
      payload,
      userId,
    );
  }
}
