import { TypeQuestionEntity } from '@/core/type-question/entities/type-question.entity';
import { TypeQuestionRepository } from '@/core/type-question/type-question.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeQuestionRepositoryImpl implements TypeQuestionRepository {
  constructor(
    @InjectRepository(TypeQuestionEntity)
    private readonly typeQuestionRepository: Repository<TypeQuestionEntity>,
  ) {}

  async findAll(): Promise<TypeQuestionEntity[]> {
    const typesQuestion = await this.typeQuestionRepository.find();

    return typesQuestion;
  }

  async findById(id: string): Promise<TypeQuestionEntity | null> {
    const type = await this.typeQuestionRepository.findOne({
      where: { id },
    });

    if (!type) return null;

    return type;
  }

  async findByType(type: string): Promise<TypeQuestionEntity | null> {
    const typeQuestion = await this.typeQuestionRepository.findOne({
      where: { type },
    });

    if (!typeQuestion) return null;

    return typeQuestion;
  }
}
