import { QuestionEntity } from '@/core/questions/entities/question.entity';
import { QuestionRepository } from '@/core/questions/question.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionsRepositoryImpl implements QuestionRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async findByQuestion(question: string): Promise<QuestionEntity | null> {
    const existQuestion = await this.questionRepository.findOne({
      where: { question },
    });

    if (!existQuestion) return null;

    return existQuestion;
  }

  async save(entity: QuestionEntity): Promise<QuestionEntity> {
    const question = await this.questionRepository.save(entity);

    return question;
  }

  async update(entity: QuestionEntity): Promise<QuestionEntity> {
    const question = await this.questionRepository.save(entity);

    return question;
  }

  async findAll(): Promise<QuestionEntity[]> {
    const questions = await this.questionRepository.find();

    return questions;
  }

  async findById(id: string): Promise<QuestionEntity | null> {
    const question = await this.questionRepository.findOne({
      where: { id },
      relations: ['typeQuestion'],
    });

    if (!question) return null;

    return question;
  }

  async deleteById(id: string): Promise<void> {
    await this.questionRepository.softDelete(id);
  }
}
