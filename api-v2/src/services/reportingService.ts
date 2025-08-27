import moment from 'moment';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { addQueue } from '../libs/redis';
import { sendMail } from '../libs/sendgrid';
import {
  OrderRepository,
  ProductRepository,
  UserRepository,
} from '../repositories';
import { generateUserSheet } from '../util/excel';

@Service()
export class ReportingService {
  constructor(
    public productRepository: ProductRepository,
    public userRepository: UserRepository,
    public orderRepository: OrderRepository
  ) {}

  sendTo: string[] = (process.env.NODE_ENV === 'production'
    ? process.env.SENDGRID_REPORT_TO_PROD
    : process.env.SENDGRID_REPORT_TO_DEV
  ).split(',');

  sendUsersReport = async (
    toEmails?: string[],
    sendGridKey?: string,
    sendGridFrom?: string,
    months: number = 1
  ): Promise<[boolean, { code: number; result: any; message?: string }]> => {
    try {
      const userQueue = addQueue('DAILY_USER', async job => {
        const [userError, users] =
          await this.userRepository.getAllUsersForReport(
            new Date(job.data.date)
          );
        const [countError, quantityActiveUsers] =
          await this.userRepository.getQuantityActiveUsersForReport(
            new Date(job.data.date)
          );
        if (userError || countError) {
          await sendMail({
            to: (process.env.SENDGRID_NOTIFIED_USER as string).split(','),
            subject: '[Alert] Daily user summary - Failed in getting data',
            text: `Please check the getAllUsersForReport or getQuantityActiveUsersForReport.
            It could because the database connection is broken`,
          });

          return [
            true,
            {
              code: 400,
              result: 'No content',
              message: 'Error while getting data for the generation',
            },
          ];
        }

        const [error, sheetContent] = await generateUserSheet(
          users.result,
          'Users'
        );
        if (error) {
          await sendMail({
            to: (process.env.SENDGRID_NOTIFIED_USER as string).split(','),
            subject: '[Alert] Daily user summary - Generated Sheet Failed',
            text: JSON.stringify(sheetContent),
          });

          return [
            error,
            {
              code: 400,
              result: sheetContent,
              message: 'Error while generating sheet data',
            },
          ];
        }

        // Send Email
        const title = `Users sheet from ${date.toLocaleDateString()} to now.`;
        const toList = toEmails.length > 0 ? toEmails : this.sendTo;

        const [sendError, sendingResult] = await sendMail({
          from: sendGridFrom,
          sendGridKey: sendGridKey,
          to: toList,
          subject: `[Daily Report]- ${title}`,
          html: `<p>Dear Soum Admin!</p>
          <p>Total number of the active users:
            <span style="font-weight:bold;color:#0077b6">${Number(
              quantityActiveUsers.result
            )}</span>
          </p>
          <p> This is auto generated email for <span style="font-weight:bold;color:#0077b6">Users</span>.</p>
          <p>Thanks in advance</p>
          <p>Tech Team</p>`,
          fileName: `summary_users_${new Date().toDateString()}.xlsx`,
          fileContent: sheetContent,
        });

        if (sendError) {
          return [
            sendError,
            {
              code: 400,
              result: sendingResult,
              message: 'Send users report unsuccessfully',
            },
          ];
        }

        return [
          sendError,
          {
            code: 200,
            result: sendingResult,
            message: 'Send users report successfully',
          },
        ];
      });
      const date = moment().subtract(months, 'month').toDate();
      const newJob = userQueue.createJob({ date: date });
      newJob.save();
      newJob.on('succeeded', () => {});

      return [
        false,
        {
          code: 200,
          result: 'Job is added to queue for running',
          message: 'Send user report successfully',
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_SEND_USER_EMAIL,
          exception.message
        );
      }
    }
  };
}
