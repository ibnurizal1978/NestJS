import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LangTags } from './entities/lang_tags.entity';
import { ILangTags } from './interfaces/lang_tags.interface';
import { LangTagsDto } from './dto/lang_tags.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/login/interfaces/jwt.payload';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class LangTagsService {
  constructor(
    @InjectRepository(LangTags)
    private readonly langTagsRepository: Repository<LangTags>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async findByEmail(tags: string): Promise<LangTags> {
    const data = await this.langTagsRepository.findOne({
      where: {
        tags: tags,
      },
    });

    if (!data) {
      throw new NotFoundException(`Tag ${tags} not found`);
    }

    return data;
  }

  public async findById(id: string): Promise<LangTags> {
    const user = await this.langTagsRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Tag #${id} not found`);
    }

    return user;
  }

  async create(langTagsDto: LangTagsDto) {
    const data = await this.langTagsRepository.query('select * FROM lang_tags WHERE tags = ?', [langTagsDto.tags]);
    if(data.length == 0) {
       const tags = langTagsDto.tags;
       const datas = await this.langTagsRepository.query("INSERT INTO lang_tags SET id = ?, tags = ?", [uuidv4(), tags]);
       return {
           message: 'OK'
       }
    }else{
      return {
          message: 'Duplicate data'
      }
    }
  }

  async findAll() {
    const data = await this.langTagsRepository.query("select id, tags FROM lang_tags");
    if(data.length > 0) {
      return {
          message: 'OK',
          data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async findOne(id: string) {
    const data = await this.langTagsRepository.query('select id, tags FROM lang_tags WHERE id = ? LIMIT 1', [id]);
    if(data.length>0) {
      return {
          message: 'OK',
          data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async update(id: string, input: any) {
    const data = await this.langTagsRepository.query("select id FROM lang_tags WHERE id = ? LIMIT 1", [id]);
    if(data.length>0) {

      const tags = input.tags;
      const datas = await this.langTagsRepository.query("UPDATE lang_tags SET tags = ? WHERE id = ? LIMIT 1", [tags, id]);
      return {
          message: 'OK'
      }
    }

    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);  
  }

  /*public async create(categoriesDto: CategoriesDto): Promise<ICategories> {
    try {
      const data = await this.categoriesRepository.create({
        ...categoriesDto,
      });
      await this.categoriesRepository.save(data);
      return data;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }*/

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

}
