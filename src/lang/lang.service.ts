import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Lang } from './entities/lang.entity';
import { ILang } from './interfaces/categories.interface';
import { LangDto } from './dto/lang.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/login/interfaces/jwt.payload';
import {v4 as uuidv4} from 'uuid';
import {} from 'uuid';

@Injectable()
export class LangService {
  constructor(
    @InjectRepository(Lang)
    private readonly langRepository: Repository<Lang>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async findByEmail(tags_id: string): Promise<Lang> {
    const data = await this.langRepository.findOne({
      where: {
        tags_id: tags_id,
      },
    });

    if (!data) {
      throw new NotFoundException(`tag ${tags_id} not found`);
    }

    return data;
  }


  async create(langDto: LangDto) {
    //const data = await this.categoriesRepository.create(categoriesDto);
    const data = await this.langRepository.query('select * FROM lang WHERE lang_categories_id = ? AND tags_id = ? LIMIT 1', [langDto.lang_categories_id, langDto.tags_id]);
    if(data.length == 0) {
        const lang_categories_id = langDto.lang_categories_id;
        const tags_id = langDto.tags_id;
        const text = langDto.text;
        const datas = await this.langRepository.query("INSERT INTO lang SET id = ?, lang_categories_id = ?, tags_id = ?, text = ?", [uuidv4(), lang_categories_id, tags_id, text]);
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
    const data = await this.langRepository.query("select b.id, title, tags, text FROM lang_categories a INNER JOIN lang b ON a.id = b.lang_categories_id INNER JOIN lang_tags c ON b.tags_id = c.id order by b.lang_categories_id desc");
    if(data.length > 0) {
      return {
          message: 'OK',
          data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async findOne(url: string) {
    const data = await this.langRepository.query('select url FROM lang_categories WHERE url = ? LIMIT 1', [url]);
    if(data.length == 0) {
      return {
          message: 'Unknown category'
      }
    }else{
      const data = await this.langRepository.query('select category_name, tags, text FROM lang_categories a INNER JOIN lang b ON a.id = b.lang_categories_id INNER JOIN lang_tags c ON b.tags_id = c.id  WHERE url = ?', [url]);
      return {
        message: 'OK',
        data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async findById(id: string) {
    const data = await this.langRepository.query('select id FROM lang WHERE id = ? LIMIT 1', [id]);
    if(data.length == 0) {
      return {
          message: 'Unknown ID'
      }
    }else{
      const data = await this.langRepository.query('select b.id, category_name, b.lang_categories_id, b.tags_id, tags, text FROM lang_categories a INNER JOIN lang b ON a.id = b.lang_categories_id INNER JOIN lang_tags c ON b.tags_id = c.id  WHERE b.id = ?', [id]);
      return {
        message: 'OK',
        data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async update(id: string, input: any) {
    const data = await this.langRepository.query("select id FROM lang WHERE id = ? LIMIT 1", [id]);
    if(data.length>0) {

      const text                = input.text;
      const lang_categories_id  = input.lang_categories_id;
      const tags_id             = input.tags_id;
      const datas = await this.langRepository.query("UPDATE lang SET text = ?, lang_categories_id = ?, tags_id = ? WHERE id = ? LIMIT 1", [text, lang_categories_id, tags_id, id]);
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
