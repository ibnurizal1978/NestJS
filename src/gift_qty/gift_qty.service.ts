import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GiftQty } from './entities/gift_qty.entity';
import { IGiftQty } from './interfaces/gift_qty.interface';
import { GiftQtyDto } from './dto/gift_qty.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/login/interfaces/jwt.payload';
import {v4 as uuidv4} from 'uuid';
import {} from 'uuid';

@Injectable()
export class GiftQtyService {
  constructor(
    @InjectRepository(GiftQty)
    private readonly giftQtyRepository: Repository<GiftQty>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async findById(id: string): Promise<GiftQty> {
    const data = await this.giftQtyRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!data) {
      throw new NotFoundException(`Data ${id} not found`);
    }

    return data;
  }


  async create(giftQtyDto: GiftQtyDto) {
    const data = await this.giftQtyRepository.query('select id FROM gift WHERE id = ? LIMIT 1', [giftQtyDto.gift_id]);
    const gift_id = giftQtyDto.gift_id;
    const qty = giftQtyDto.qty;
    const qty_action = giftQtyDto.qty_action;

    //is the gift_id registered? if not, reject it.
    if(data.length == 0) {
      return {
        message: 'Unkonwn ID'
      }
    }

    //is user type quantity less than 1? reject it.
    if(qty < 1)
    {
      return {
        message: 'Quantity must be greater than 0'
      }          
    }

    //is the qty_action VALUE is ADD or REDEEM or ALLOCATED? Otherwise must reject it.
    if(qty_action != "ADD" && qty_action != "REDEEM" && qty_action != "ALLOCATED")
    {
      return {
        message: 'Action must be ADD, REDEEM or ALLOCATED'
      }          
    }

    //Ok, now we must count the available quantity (total ADD for this gift_id)
    const total_add = await this.giftQtyRepository.query("SELECT sum(qty) as total_add FROM gift_qty WHERE gift_id = ? AND qty_action =  'ADD' ", [gift_id]);

    //then, count the total ALLOCATED for this gift_id
    const total_allocated = await this.giftQtyRepository.query("SELECT sum(qty) as total_allocated FROM gift_qty WHERE gift_id = ? AND qty_action =  'ALLOCATED' ", [gift_id]);

    //then, count the total REDEEM for this gift_id
    const total_redeem = await this.giftQtyRepository.query("SELECT sum(qty) as total_redeem FROM gift_qty WHERE gift_id = ? AND qty_action =  'REDEEM' ", [gift_id]);

    //check if qty_action = ALLOCATED but total_available < total_allocated?   
    if(qty_action == "ALLOCATED" && qty + Number.parseInt(total_allocated[0].total_allocated) > Number.parseInt(total_add[0].total_add))
    {
      return {
        //qty: qty,
        //total_new_allocated: qty + Number.parseInt(total_allocated[0].total_allocated),
        //allo: Number.parseInt(total_allocated[0].total_allocated),
        //total_add:  Number.parseInt(total_add[0].total_add),
        //add_total_add:  qty + Number.parseInt(total_add[0].total_add),
        message: 'Allocated quantity cannot be larger than available quantity'
      }          
    }

    //check if qty_action = REDEEM but qty redeem > total_allocated? must reject   
    if(qty_action == "REDEEM" && qty + Number.parseInt(total_redeem[0].total_redeem) > Number.parseInt(total_allocated[0].total_allocated))
    {
      return {
        message: 'Redeem quantity cannot be larger than allocated quantity'
      }          
    }

    //everything is correct so insert the quantity
    const datas = await this.giftQtyRepository.query("INSERT INTO gift_qty SET id = ?, gift_id = ?, qty = ?, qty_action = ?", [uuidv4(), gift_id, qty, qty_action]);
    return {
      message: 'OK'
    }
      
  }

  public async findAll(): Promise<GiftQty[]> {
    const data = await this.giftQtyRepository.find()    

    if (!data) {
      throw new NotFoundException(`Data not found`);
    }

    return data;
  }


  async update(id: string, input: any) {
    const data = await this.giftQtyRepository.query("select id FROM gift WHERE id = ? LIMIT 1", [id]);
    if(data.length>0) {

      const name      = input.name;
      const datas = await this.giftQtyRepository.query("UPDATE gift SET name = ? WHERE id = ? LIMIT 1", [name, id]);
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
