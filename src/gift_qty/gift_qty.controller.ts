import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { Response } from 'express';
import { GiftQtyService } from './gift_qty.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateGiftQtyDto } from './dto/update_gift_qty.dto';
import { GiftQtyDto } from './dto/gift_qty.dto';
import * as path from 'path';

@Controller('gift_qty')
export class GiftQtyController {
  constructor(private readonly giftQtyService: GiftQtyService) {}

  @ApiTags('gift_qty')
  @ApiOperation({ summary: 'API for add gift qty by action type' })
  @Post()
  create(@Body() giftQtyDto: GiftQtyDto) {
    return this.giftQtyService.create(giftQtyDto);
  }

  @ApiTags('gift_qty')
  @ApiOperation({ summary: 'API for view gift data' })
  @Get()
  findAll() {
    return this.giftQtyService.findAll();
  }

  @ApiTags('gift_qty')
  @ApiOperation({ summary: 'API for view gift based on ID' })
  @Get('id/:id')
  findById(@Param('id') id: string) {
    return this.giftQtyService.findById(id);
  }

}

