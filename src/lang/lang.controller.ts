import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { Response } from 'express';
import { LangService } from './lang.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateLangDto } from './dto/update_lang.dto';
import { LangDto } from './dto/lang.dto';
import * as path from 'path';

@Controller('lang')
export class LangController {
  constructor(private readonly langService: LangService) {}

  @ApiTags('lang')
  @ApiOperation({ summary: 'API for create lang' })
  @Post()
  create(@Body() langDto: LangDto) {
    return this.langService.create(langDto);
  }

  @ApiTags('lang')
  @ApiOperation({ summary: 'API for view lang' })
  @Get()
  findAll() {
    return this.langService.findAll();
  }

  @ApiTags('lang')
  @ApiOperation({ summary: 'API for view all lang based on url' })
  @Get(':url')
  findOne(@Param('url') url: string) {
    return this.langService.findOne(url);
  }

  @ApiTags('lang')
  @ApiOperation({ summary: 'API for view all lang based on ID' })
  @Get('id/:id')
  findById(@Param('id') id: string) {
    return this.langService.findById(id);
  }

  @ApiTags('lang')
  @ApiOperation({ summary: 'API for update lang based on ID' })
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateLangDto: UpdateLangDto) {
    return this.langService.update(id, updateLangDto);
  }

}
