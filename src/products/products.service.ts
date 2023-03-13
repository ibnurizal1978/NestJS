import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity';
import { IProducts } from './interfaces/products.interface';
import { ProductsDto } from './dto/products.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/login/interfaces/jwt.payload';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepository: Repository<Products>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async findByEmail(category_name: string): Promise<Products> {
    const data = await this.productsRepository.findOne({
      where: {
        category_name: category_name,
      },
    });

    if (!data) {
      throw new NotFoundException(`Category ${category_name} not found`);
    }

    return data;
  }

  public async findById(id: string): Promise<Products> {
    const user = await this.productsRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    return user;
  }

  async create(productsDto: ProductsDto) {
    const data = await this.productsRepository.query('select category_name FROM categories WHERE category_name = ?', [productsDto.category_name]);
    if(data.length > 0) {
      const category_name = productsDto.category_name;
      const model         = productsDto.model;
      const description   = productsDto.description;
      const datas = await this.productsRepository.query("INSERT INTO products SET id = ?, category_name = ?, model = ?, description = ?", [uuidv4(), category_name, model, description]);
      return {
          message: 'OK'
      }
    }else{
      return {
          message: 'Wrong category name'
      }
    }
  }

  async findAll() {
    const data = await this.productsRepository.query("select id, category_name, model, description FROM products");
    if(data.length > 0) {
      return {
          message: 'OK',
          data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async findOne(id: string) {
    const data = await this.productsRepository.query('select id, category_name, model, description FROM products WHERE id = ? LIMIT 1', [id]);
    if(data.length>0) {
      return {
          message: 'OK',
          data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }

  async update(id: string, input: any) {
    const data = await this.productsRepository.query("select id FROM products WHERE id = ? LIMIT 1", [id]);
    if(data.length>0) {
      const category_name = input.category_name;
      const model = input.model;
      const description = input.description;

      const check_data = await this.productsRepository.query("SELECT category_name FROM products_categories WHERE category_name = ? LIMIT 1", [category_name]);
      if(check_data.length == 0) {
        return {
            message: 'There is wrong category name and would not be inserted'
        }
      }else{
        const datas = await this.productsRepository.query("UPDATE products SET category_name = ?, model = ?, description = ? WHERE id = ? LIMIT 1", [category_name, model, description, id]);
        return {
            message: 'OK'
        }
      }
    }

    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);  
  }


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

  async upload(category: string, model: string, description: string) {
    const truncate = await this.productsRepository.query("truncate products");
    const datas = await this.productsRepository.query("INSERT INTO products SET id = ?, category_name = ?, model = ?, description = ?", [uuidv4(), category, model, description]);
    const deletes = await this.productsRepository.query("DELETE FROM products WHERE category_name NOT IN (select category_name FROM products_categories)");
    /*const check_data = await this.productsRepository.query("SELECT category_name FROM categories WHERE category_name = ? LIMIT 1", [category]);
    if(check_data.length == 0) {
      return {
          message: 'There is wrong category name'
      }
    }else{ 
      const datas = await this.productsRepository.query("INSERT INTO products SET id = ?, category_name = ?, model = ?, description = ?", [uuidv4(), category, model, description]);
      return {
          message: 'OK'
      } 
    }*/
  }

}