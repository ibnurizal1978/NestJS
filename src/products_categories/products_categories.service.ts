import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsCategories } from './entities/products_categories.entity';
import { ProductsCategoriesDto } from './dto/products_categories.dto';
import { IProductsCategories } from './interfaces/products_categories.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/login/interfaces/jwt.payload';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class ProductsCategoriesService {
  constructor(
    @InjectRepository(ProductsCategories)
    private readonly productsCategoriesRepository: Repository<ProductsCategories>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async findByEmail(category_name: string): Promise<ProductsCategories> {
    const data = await this.productsCategoriesRepository.findOne({
      where: {
        category_name: category_name,
      },
    });

    if (!data) {
      throw new NotFoundException(`Category ${category_name} not found`);
    }

    return data;
  }

  public async findById(id: string): Promise<ProductsCategories> {
    const user = await this.productsCategoriesRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    return user;
  }

  async create(categoriesDto: ProductsCategoriesDto) {
    //const data = await this.categoriesRepository.create(categoriesDto);
    const data = await this.productsCategoriesRepository.query('select * FROM products_categories WHERE category_name = ?', [categoriesDto.category_name]);
    if(data.length == 0) {
       const category_name = categoriesDto.category_name;
       const datas = await this.productsCategoriesRepository.query("INSERT INTO products_categories SET id = ?, category_name = ?", [uuidv4(), category_name]);
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
    const data = await this.productsCategoriesRepository.query("select id, category_name FROM products_categories");
    if(data.length > 0) {
      return {
          message: 'OK',
          data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async findOne(id: string) {
    const data = await this.productsCategoriesRepository.query('select id, category_name FROM products_categories WHERE id = ? LIMIT 1', [id]);
    if(data.length>0) {
      return {
          message: 'OK',
          data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async update(id: string, input: any) {
    const data = await this.productsCategoriesRepository.query("select id FROM products_categories WHERE id = ? LIMIT 1", [id]);
    if(data.length>0) {

      const category_name = input.category_name;
      const datas = await this.productsCategoriesRepository.query("UPDATE products_categories SET category_name = ? WHERE id = ? LIMIT 1", [category_name, id]);
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
