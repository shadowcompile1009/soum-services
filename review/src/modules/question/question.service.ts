import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { deleteWithPattern } from '@src/utils/redis';
import * as crypto from 'crypto';
import mongoose, { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {
  Question,
  QuestionStatus,
  QuestionType,
} from './schemas/question.schema';
import { Questionnaire } from './schemas/questionnaire.schema';
import { toKebabCase } from './utils';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel('Question')
    private readonly questionModel: Model<Question>,
    @InjectModel('Questionnaire')
    private readonly questionnaireModel: Model<Questionnaire>,
  ) {}

  async generateQuestionId(
    createQuestionDto: CreateQuestionDto,
  ): Promise<string> {
    const questionnaire = await this.questionnaireModel.findById(
      createQuestionDto.questionnaireId,
    );
    if (!questionnaire) {
      throw new NotFoundException('Questionnaire not found');
    }

    return `${toKebabCase(questionnaire.categoryName)}-${crypto.randomBytes(4).toString('hex')}`;
  }

  async getCurrentVersion(questionId: string): Promise<Question> {
    if (!questionId) {
      return null;
    }
    const result = await this.questionModel
      .find({
        questionId: questionId,
        status: QuestionStatus.Active,
      })
      .sort({
        version: -1,
      })
      .exec();

    return result ? result[0] : null;
  }

  async getLatestVersionNumber(
    questionDto: CreateQuestionDto | UpdateQuestionDto,
    isNew: boolean,
  ): Promise<number> {
    if (!questionDto.questionId) {
      questionDto.questionId = await this.generateQuestionId(questionDto);
    }

    const currentVersion = await this.getCurrentVersion(questionDto.questionId);

    if (isNew && currentVersion) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'Question already exists',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (currentVersion?.version) {
      return currentVersion.version++;
    }

    return 1;
  }

  async updateQuestionnaireVersions(questionId: string, newVersion: number) {
    await deleteWithPattern(`questionnaires-*`);
    await this.questionnaireModel.updateMany(
      { 'questions.questionId': questionId },
      { $set: { 'questions.$[elem].version': newVersion } },
      { arrayFilters: [{ 'elem.questionId': questionId }] },
    );
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const questionId = await this.generateQuestionId(createQuestionDto);
    const latestVersionNumber = await this.getLatestVersionNumber(
      createQuestionDto,
      true,
    );
    const questionData: any = {
      questionId: questionId,
      questionEn: createQuestionDto.questionEn,
      questionAr: createQuestionDto.questionAr,
      questionType: createQuestionDto.questionType || QuestionType.YesNo,
      options: createQuestionDto.options,
      status: createQuestionDto.status || QuestionStatus.Active,
      version: latestVersionNumber,
    };
    if (createQuestionDto.questionType === QuestionType.InputText) {
      questionData.placeholderTextEn = createQuestionDto.placeholderTextEn;
      questionData.placeholderTextAr = createQuestionDto.placeholderTextAr;
      questionData.subTextEn = createQuestionDto.subTextEn;
      questionData.subTextAr = createQuestionDto.subTextAr;
      questionData.isMandatory = createQuestionDto.isMandatory || false;
      questionData.options = [];
    }
    const question = new this.questionModel(questionData);
    await question.save();

    // Add to a questionnaire
    if (createQuestionDto.questionnaireId) {
      const questionnaire = await this.questionnaireModel
        .findById(
          new mongoose.Types.ObjectId(createQuestionDto.questionnaireId),
        )
        .exec();

      if (questionnaire) {
        questionnaire.questions.push({
          questionId: questionId,
          version: latestVersionNumber,
          order: createQuestionDto.order || questionnaire.questions.length + 1,
          isRequired: true,
        });
        await questionnaire.save();

        await deleteWithPattern(`questionnaires-${questionnaire.categoryId}-*`);
      }
    }

    return question;
  }

  async update(questionId: string, updateQuestionDto: UpdateQuestionDto) {
    if (!questionId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'questionId is required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const latestVersion = await this.getCurrentVersion(questionId);
    if (!latestVersion || !latestVersion.version) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: 'The question is unavailable or deleted',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (updateQuestionDto.keepVersion) {
      await this.questionModel.findByIdAndUpdate(latestVersion._id, {
        questionEn: updateQuestionDto.questionEn,
        questionAr: updateQuestionDto.questionAr,
      });
    } else {
      // Set all previous versions to inactive
      await this.questionModel.updateMany(
        { questionId: questionId, version: { $lt: latestVersion.version + 1 } },
        { $set: { status: QuestionStatus.Inactive } },
      );
      const newVersion = latestVersion.version + 1;
      const questionData: any = {
        questionId: questionId,
        questionEn: updateQuestionDto.questionEn,
        questionAr: updateQuestionDto.questionAr,
        questionType: updateQuestionDto.questionType || QuestionType.YesNo,
        options: updateQuestionDto.options,
        status: updateQuestionDto.status || QuestionStatus.Active,
        version: newVersion,
      };
      if (updateQuestionDto.questionType === QuestionType.InputText) {
        questionData.placeholderTextEn = updateQuestionDto.placeholderTextEn;
        questionData.placeholderTextAr = updateQuestionDto.placeholderTextAr;
        questionData.subTextEn = updateQuestionDto.subTextEn;
        questionData.subTextAr = updateQuestionDto.subTextAr;
        questionData.isMandatory = updateQuestionDto.isMandatory || false;
      }
      const question = new this.questionModel(questionData);
      await question.save();

      await this.updateQuestionnaireVersions(questionId, newVersion);
      return question;
    }
  }

  async remove(questionId: string) {
    const currentQuestion = await this.getCurrentVersion(questionId);
    if (!currentQuestion) {
      throw new NotFoundException(`Question with id ${questionId} not found`);
    }
    const question = await this.questionModel.updateMany(
      { questionId: questionId, status: 'active' },
      { $set: { status: QuestionStatus.Deleted, deletedAt: Date.now() } },
    );

    await deleteWithPattern(`questionnaires-*`);
    return { message: `Question ${questionId} deleted successfully` };
  }

  findAll(page: number = 1, pageSize: number = 20) {
    return this.questionModel.find().exec();
  }

  findOne(id: mongoose.Types.ObjectId) {
    return this.questionModel.findById(id).exec();
  }
}
