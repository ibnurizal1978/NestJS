import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { Response } from 'express';
import { GiftService } from './gift.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateGiftDto } from './dto/update_gift.dto';
import { GiftDto } from './dto/gift.dto';
import * as path from 'path';

@Controller('gift')
export class GiftController {
  constructor(private readonly giftService: GiftService) {}

  @ApiTags('gift')
  @ApiOperation({ summary: 'API for create gift' })
  @Post()
  create(@Body() langDto: GiftDto) {
    return this.giftService.create(langDto);
  }

  @ApiTags('gift')
  @ApiOperation({ summary: 'API for view gift data' })
  @Get()
  findAll() {
    return this.giftService.findAll();
  }

  @ApiTags('gift')
  @ApiOperation({ summary: 'API for view gift based on ID' })
  @Get('id/:id')
  findById(@Param('id') id: string) {
    return this.giftService.findById(id);
  }

  @ApiTags('gift')
  @ApiOperation({ summary: 'API for update gift based on ID' })
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateLangDto: UpdateGiftDto) {
    return this.giftService.update(id, updateLangDto);
  }

}
