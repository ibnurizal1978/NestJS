import { Controller, Body, Post, Get, Param } from '@nestjs/common';
import { ProductsCategoriesService } from './products_categories.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProductsCategoriesDto } from './dto/update_products_categories.dto';
import { ProductsCategoriesDto } from './dto/products_categories.dto';

@Controller('products_categories')
export class ProductsCategoriesController {
  constructor(private readonly productsCategoriesService: ProductsCategoriesService) {}

  /*@ApiTags('category')
  @ApiOperation({ summary: 'API for create category' })
  @Post('/create')
  async updatePassword(@Body() payload: UpdateCategoriesDto) {
    return this.cateogriesService.updateByName(payload.token);
  }*/

  @ApiTags('products_categories')
  @ApiOperation({ summary: 'API for create category' })
  @Post()
  create(@Body() productsCategoriesDto: ProductsCategoriesDto) {
    return this.productsCategoriesService.create(productsCategoriesDto);
  }

  @ApiTags('products_categories')
  @ApiOperation({ summary: 'API for view category' })
  @Get()
  findAll() {
    return this.productsCategoriesService.findAll();
  }

  @ApiTags('products_categories')
  @ApiOperation({ summary: 'API for view one category name based on ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsCategoriesService.findOne(id);
  }

  @ApiTags('products_categories')
  @ApiOperation({ summary: 'API for update category based on ID' })
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateProductsCategoriesDto: UpdateProductsCategoriesDto) {
    return this.productsCategoriesService.update(id, updateProductsCategoriesDto);
  }

}
