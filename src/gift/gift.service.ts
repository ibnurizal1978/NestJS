import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Gift } from './entities/gift.entity';
import { IGift } from './interfaces/gift.interface';
import { GiftDto } from './dto/gift.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/login/interfaces/jwt.payload';
import {v4 as uuidv4} from 'uuid';
import {} from 'uuid';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(Gift)
    private readonly giftRepository: Repository<Gift>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async findById(id: string): Promise<Gift> {
    const data = await this.giftRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!data) {
      throw new NotFoundException(`Data ${id} not found`);
    }

    return data;
  }


  async create(input: any) {
    //const data = await this.categoriesRepository.create(categoriesDto);
    const data = await this.giftRepository.query('select * FROM gift WHERE name = ? LIMIT 1', [input.name]);
    if(data.length == 0) {
        const name = input.name;
        const qty = input.qty;

        if(qty < 1) {
          return {
            message: 'Quantity must be greater than zero'
          }
        }

        const datas = await this.giftRepository.query("INSERT INTO gift SET id = ?, name = ?", [uuidv4(), name]);
        const datas2 = await this.giftRepository.query("SELECT id FROM gift ORDER BY created_at DESC LIMIT 1");
        const datas3 = await this.giftRepository.query("INSERT INTO gift_qty SET id = ?, gift_id = ?, qty = ?, qty_action = 'ADD'", [uuidv4(), datas2[0].id, qty]);
        return {
          data: datas2[0].id,
          message: 'OK'
        }
    }else{
      return {
        message: 'Duplicate data'
      }
    }
  }

  public async findAll() {
    const data = await this.giftRepository.query("SELECT gift_id, name, SUM(qty * CASE qty_action WHEN 'ADD' THEN 1 ELSE 0 END) AS 'stock_in_hand', SUM(qty * CASE qty_action WHEN 'ALLOCATED' THEN 1 ELSE 0 END) AS 'allocated', SUM(qty * CASE qty_action WHEN 'REDEEM' THEN 1 ELSE 0 END) AS 'redeem', SUM(qty * CASE qty_action WHEN 'ADD' THEN 1 WHEN 'ALLOCATED' THEN -1 ELSE 0 END) AS 'available' FROM gift a INNER JOIN gift_qty b ON a.id = b.gift_id GROUP BY a.id");
    if(data.length > 0) {
      return {
          message: 'OK',
          data: data
      }
    }
    throw new HttpException('Data Not Found', HttpStatus.BAD_REQUEST);
  }


  async update(id: string, input: any) {
    const data = await this.giftRepository.query("select id FROM gift WHERE id = ? LIMIT 1", [id]);
    const name      = input.name;
    if(data.length>0) {

      //check for duplicate name
      const data2 = await this.giftRepository.query("select name FROM gift WHERE name = ? AND id <> ? LIMIT 1", [name, id]);
      if(data2.length>0) {
        return {
          message: 'Duplicate name'
        }
      }

      //success to update
      const datas = await this.giftRepository.query("UPDATE gift SET name = ? WHERE id = ? LIMIT 1", [name, id]);
      return {
          message: 'OK'
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


}
