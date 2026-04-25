import { QuestionOptionEntity } from '@/core/question-options/entities/question-option.entity';
import { QuestionOptionsRepository } from '@/core/question-options/question-options.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionOptionsRepositoryImpl implements QuestionOptionsRepository {
  constructor(
    @InjectRepository(QuestionOptionEntity)
    private readonly questionOptionsRepository: Repository<QuestionOptionEntity>,
  ) {}

  async findByQuestionOption(
    option: string,
    questionId: string,
  ): Promise<QuestionOptionEntity | null> {
    const questionOptions = await this.questionOptionsRepository.findOne({
      where: { option, question: { id: questionId } },
    });

    if (!questionOptions) return null;

    return questionOptions;
  }

  async save(entity: QuestionOptionEntity): Promise<QuestionOptionEntity> {
    const questionOptions = await this.questionOptionsRepository.save(entity);

    return questionOptions;
  }

  async update(entity: QuestionOptionEntity): Promise<QuestionOptionEntity> {
    const questionOptions = await this.questionOptionsRepository.save(entity);

    return questionOptions;
  }

  async findAll(): Promise<QuestionOptionEntity[]> {
    const questionsOptions = await this.questionOptionsRepository.find({
      relations: ['question', 'question.typeQuestion'],
    });

    return questionsOptions;
  }

  async findById(id: string): Promise<QuestionOptionEntity | null> {
    const questionOptions = await this.questionOptionsRepository.findOne({
      where: { id },
    });

    if (!questionOptions) return null;

    return questionOptions;
  }

  async deleteById(id: string): Promise<void> {
    await this.questionOptionsRepository.softDelete(id);
  }
}
