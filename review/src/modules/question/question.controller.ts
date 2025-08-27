import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import mongoose from 'mongoose';
import { CategoryService } from '../category/category.service';
import { Category } from '../grpc/proto/category.pb';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateQuestionnaireDto } from './dto/create-questionnaire.dto';
import { PaginatedDto } from './dto/paginated.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { QuestionService } from './question.service';
import { QuestionnaireService } from './questionnaire.service';
import { Question } from './schemas/question.schema';
import {
  Questionnaire,
  QuestionnaireStatus,
} from './schemas/questionnaire.schema';

@Controller('/question')
@ApiTags('Question')
export class QuestionController {
  constructor(
    private readonly questionnaireService: QuestionnaireService,
    private readonly questionService: QuestionService,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('/filter')
  @ApiOperation({
    summary: 'Get questionnaires with pagination',
  })
  @ApiQuery({ name: 'categoryId', type: 'string', required: true })
  @ApiQuery({ name: 'size', type: 'number', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiOkResponse({ type: PaginatedDto<Questionnaire> })
  async fetchQuestionnaireByCategoryId(
    @Query('categoryId') categoryId: string,
    @Query('size') size: number,
    @Query('page') page: number,
  ): Promise<PaginatedDto<Questionnaire>> {
    const questionnairesResult = await this.questionnaireService.findAll(
      categoryId,
      page,
      size,
    );

    if (
      !questionnairesResult?.questionnaires ||
      questionnairesResult?.questionnaires.length === 0
    ) {
      try {
        // Get category
        const categories = await this.categoryService.getCategories({
          limit: 100,
          offset: 0,
          type: 'category',
        });
        const category = categories.categories.find(
          (value: Category) => value.id == categoryId,
        );
        // Create a questionnaire for this category
        const newQuestionnaire = await this.questionnaireService.create({
          descriptionAr: '',
          descriptionEn: '',
          questions: [],
          status: QuestionnaireStatus.Active,
          categoryId: categoryId,
          categoryName: category?.name,
        });

        return {
          items: [newQuestionnaire],
          total: 1,
          limit: size || 20,
          offset: 0,
        };
      } catch (error) {
        console.log('🚀 ~ QuestionController ~ error:', error);
        return {
          items: [],
          total: 0,
          limit: size || 20,
          offset: 0,
        };
      }
    }

    return {
      items: questionnairesResult.questionnaires,
      total: questionnairesResult.count,
      limit: size,
      offset: (page - 1) * size,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Question> {
    return this.questionService.findOne(new mongoose.Types.ObjectId(id));
  }

  @Post('/questionnaire')
  @ApiOperation({
    summary: 'Create a questionnaire with/ without questions',
  })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async createQuestionnaire(
    @Body() createQuestionnaireDto: CreateQuestionnaireDto,
  ) {
    return this.questionnaireService.create(createQuestionnaireDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Put('/questionnaire/:questionnaireId')
  @ApiOperation({
    summary: 'Update a questionnaire',
  })
  @ApiHeader({ name: 'token', required: true })
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async updateQuestionnaire(
    @Param('questionnaireId') questionnaireId: string,
    @Body() updateQuestionnaireDto: UpdateQuestionnaireDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(questionnaireId)) {
      throw new BadRequestException(
        `Questionnaire ID ${questionnaireId} is not valid`,
      );
    }

    return this.questionnaireService.update(
      new mongoose.Types.ObjectId(questionnaireId),
      updateQuestionnaireDto,
    );
  }

  @Put(':id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async remove(@Param('id') id: string) {
    return this.questionService.remove(id);
  }
}
