import {
  BadRequestException,
  Injectable,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PromoCode,
  PromoCodeDocument,
  PromoCodeGenerationTask,
  PromoCodeGenerationTaskDocument,
} from './schemas';
import { Model } from 'mongoose';
import {
  BulkGenerationPromoCodeDto,
  WritePromoCodeDto,
  WritePromoCodeGenerationTaskDto,
} from './dto';
import { PromoCodeService } from './promo-code.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import constants from '@src/constant';
import { PromoCodeGenerationTaskStatus } from './enum';
import { getErrorMessage } from './constants';

@Injectable()
export class PromoCodeGenerationTaskService {
  constructor(
    @InjectModel(PromoCode.name)
    private readonly promoCodeModel: Model<PromoCodeDocument>,
    @InjectModel(PromoCodeGenerationTask.name)
    private readonly promoCodeGenerationTaskModel: Model<PromoCodeGenerationTaskDocument>,
    @Inject(forwardRef(() => PromoCodeService))
    private readonly promoCodeService: PromoCodeService,
    @InjectQueue(constants.BULL_MQ_QUEUE_NAMES.PROMO_CODE_QUEUE)
    private readonly queue: Queue,
  ) {}

  generatePromoSuffix(length = 3): string {
    let result = '';
    const characters =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters[randomIndex];
    }

    return result;
  }

  async handleBulkPromoCreation({
    taskId,
    createPromoCodeDto,
  }: {
    taskId: string;
    createPromoCodeDto: WritePromoCodeDto;
  }) {
    try {
      const task = await this.getById(taskId);
      if (!task) throw new Error('Task not found');

      const promosToGenerate = task.totalPromos - task.totalGenerated;

      const parentPromoCode = await this.promoCodeService.getPromoCodeById(
        task.parentPromoCodeId,
      );
      const generatedPromos = new Set<string>();
      for (let i = 1; i <= promosToGenerate; i++) {
        generatedPromos.add(
          `${parentPromoCode.bulkPrefix}${this.generatePromoSuffix()}`,
        );
      }

      const existingPromoCodes =
        await this.promoCodeService.getPromoCodesByCodes([...generatedPromos]);

      existingPromoCodes.forEach((existingPromoCode) => {
        generatedPromos.delete(existingPromoCode.code);
      });

      let promoDtos: BulkGenerationPromoCodeDto[] = [];
      generatedPromos.forEach((promo) => {
        promoDtos = [
          ...promoDtos,
          {
            ...createPromoCodeDto,
            code: promo,
            parentPromoCodeId: task.parentPromoCodeId,
            taskId: taskId,
            bulkPrefix: '',
          },
        ];
      });

      const promoCreation = await this.promoCodeModel.insertMany(promoDtos);

      task.totalGenerated += promoCreation.length;
      if (task.totalGenerated >= task.totalPromos) {
        task.taskStatus = PromoCodeGenerationTaskStatus.COMPLETED;
      }
      await task.save();
      if (task.taskStatus !== PromoCodeGenerationTaskStatus.COMPLETED) {
        await this.queue.add(
          constants.BULL_MQ_TASK_NAMES.BULK_GENERATE_PROMO_CODES,
          { createPromoCodeDto, taskId },
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async create(dto: WritePromoCodeGenerationTaskDto) {
    return await this.promoCodeGenerationTaskModel.create(dto);
  }
  async getById(id: string) {
    return await this.promoCodeGenerationTaskModel.findById(id);
  }

  async bulkGeneratePromoCodes(createPromoCodeDto: WritePromoCodeDto) {
    if (createPromoCodeDto.code) {
      throw new BadRequestException(
        getErrorMessage('CODE_CANNOT_BE_SPECIFIED_FOR_BULK_GENERATION'),
      );
    }
    const parentPromoCode = await this.promoCodeService.create(
      createPromoCodeDto,
    );

    const task = await this.create({
      parentPromoCodeId: parentPromoCode._id,
      totalPromos: createPromoCodeDto.totalCodes,
    });
    await this.queue.add(
      constants.BULL_MQ_TASK_NAMES.BULK_GENERATE_PROMO_CODES,
      { createPromoCodeDto, taskId: task._id },
    );
    return task;
  }

  async getByParentPromoCodeId(parentPromoCodeId: string) {
    return await this.promoCodeGenerationTaskModel.findOne({
      parentPromoCodeId,
    });
  }
}
