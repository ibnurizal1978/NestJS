import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { LangCategoriesService } from './lang_categories.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateLangCategoriesDto } from './dto/update_lang_categories.dto';
import { LangCategoriesDto } from './dto/lang_categories.dto';

@Controller('lang_categories')
export class LangCategoriesController {
  constructor(private readonly langCategoriesService: LangCategoriesService) {}

  /*@ApiTags('category')
  @ApiOperation({ summary: 'API for create category' })
  @Post('/create')
  async updatePassword(@Body() payload: UpdateCategoriesDto) {
    return this.cateogriesService.updateByName(payload.token);
  }*/

  @ApiTags('lang_category')
  @ApiOperation({ summary: 'API for create lang category' })
  @Post()
  create(@Body() langCategoriesDto: LangCategoriesDto) {
    return this.langCategoriesService.create(langCategoriesDto);
  }

  @ApiTags('lang_category')
  @ApiOperation({ summary: 'API for view lang category' })
  @Get()
  findAll() {
    return this.langCategoriesService.findAll();
  }

  @ApiTags('lang_category')
  @ApiOperation({ summary: 'API for view one lang category name based on ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.langCategoriesService.findOne(id);
  }

  @ApiTags('lang_category')
  @ApiOperation({ summary: 'API for update lang category based on ID' })
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateCategoriesDto: UpdateLangCategoriesDto) {
    return this.langCategoriesService.update(id, updateCategoriesDto);
  }

}
