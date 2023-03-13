import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LangCategories } from './entities/lang_categories.entity';
import { ILangCategories } from './interfaces/lang_categories.interface';
import { LangCategoriesDto } from './dto/lang_categories.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/login/interfaces/jwt.payload';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class LangCategoriesService {
  constructor(
    @InjectRepository(LangCategories)
    private readonly langCategoriesRepository: Repository<LangCategories>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async findByEmail(category_name: string): Promise<LangCategories> {
    const data = await this.langCategoriesRepository.findOne({
      where: {
        category_name: category_name,
      },
    });

    if (!data) {
      throw new NotFoundException(`Category ${category_name} not found`);
    }

    return data;
  }

  public async findById(id: string): Promise<LangCategories> {
    const user = await this.langCategoriesRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    return user;
  }

  async create(langCategoriesDto: LangCategoriesDto) {
    //const data = await this.categoriesRepository.create(categoriesDto);
    const data = await this.langCategoriesRepository.query('select * FROM lang_categories WHERE category_name = ?', [langCategoriesDto.category_name]);
    if(data.length == 0) {
       const category_name = langCategoriesDto.category_name;
       const url           = langCategoriesDto.url;
       const title         = langCategoriesDto.title;
       const datas = await this.langCategoriesRepository.query("INSERT INTO lang_categories SET id = ?, category_name = ?, url = ?, title = ?", [uuidv4(), category_name, url, title]);
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
    const data = await this.langCategoriesRepository.query("select id, category_name, url, title FROM lang_categories");
    if(data.length > 0) {
      return {
          message: 'OK',
          data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async findOne(id: string) {
    const data = await this.langCategoriesRepository.query('select id, category_name, url, title FROM lang_categories WHERE id = ? LIMIT 1', [id]);
    if(data.length>0) {
      return {
          message: 'OK',
          data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async update(id: string, input: any) {
    const data = await this.langCategoriesRepository.query("select id FROM lang_categories WHERE id = ? LIMIT 1", [id]);
    if(data.length>0) {

      const category_name = input.category_name;
      const url           = input.url;
      const title         = input.title;    
      const datas = await this.langCategoriesRepository.query("UPDATE lang_categories SET category_name = ?, url = ?, title = ? WHERE id = ? LIMIT 1", [category_name, url, title, id]);
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
