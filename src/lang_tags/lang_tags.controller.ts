import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { LangTagsService } from './lang_tags.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateLangTagsDto } from './dto/update_lang_tags.dto';
import { LangTagsDto } from './dto/lang_tags.dto';
import * as path from 'path';

@Controller('lang_tags')
export class LangTagsController {
  constructor(private readonly langTagsService: LangTagsService) {}

  /*@ApiTags('category')
  @ApiOperation({ summary: 'API for create category' })
  @Post('/create')
  async updatePassword(@Body() payload: UpdateCategoriesDto) {
    return this.cateogriesService.updateByName(payload.token);
  }*/

  @ApiTags('lang_tags')
  @ApiOperation({ summary: 'API for create language tags' })
  @Post()
  create(@Body() langTagsDto: LangTagsDto) {
    return this.langTagsService.create(langTagsDto);
  }

  @ApiTags('lang_tags')
  @ApiOperation({ summary: 'API for view language tags' })
  @Get()
  findAll() {
    return this.langTagsService.findAll();
  }

  @ApiTags('lang_tags')
  @ApiOperation({ summary: 'API for view one language tags name based on ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.langTagsService.findOne(id);
  }

  @ApiTags('lang_tags')
  @ApiOperation({ summary: 'API for update language tags based on ID' })
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateLangTagsDto: UpdateLangTagsDto) {
    return this.langTagsService.update(id, updateLangTagsDto);
  }

}
