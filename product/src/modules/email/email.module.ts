import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { SendGridClient } from './sendgrid-client';
import { V2Module } from '../v2/v2.module';
import { ConfigModule } from '@nestjs/config';
import emailConfig from '@src/config/email.config';

@Module({
  imports: [
    V2Module,
    ConfigModule.forRoot({
      load: [emailConfig],
    }),
  ],
  providers: [EmailService, SendGridClient],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
