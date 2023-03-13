import { Controller, Body, Post, Get, Param, UseInterceptors, UploadedFile, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProductsDto } from './dto/update_products.dto';
import { ProductsDto } from './dto/products.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as XLSX from 'xlsx';
const Excel = require('exceljs');

// Multer configuration
export const multerConfig = {
  //dest: process.env.UPLOAD_LOCATION,
  dest: './file_upload',
};
// Multer upload options
export const multerOptions = {
  // Enable file size limits
  limits: {
      //fileSize: +process.env.MAX_FILE_SIZE,
      fileSize: 100000000,
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
      //if (file.mimetype.match(/\/(xlsx|xls|jpg|jpeg)$/)) {
      if(file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          //return cb(new HttpException(`Success`, HttpStatus.OK), true);
          return cb(null, true);
          //cb(new HttpException(`success`, HttpStatus.OK), true);
      } else {
          // Reject file
          cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
      }
  },
  // Storage properties
  storage: diskStorage({
      destination: (req: any, file: any, cb: any) => {
          const uploadPath = multerConfig.dest;
          if (!existsSync(uploadPath)) {
              mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
      },
      // save file
      filename: (req: any, file: any, cb: any) => {
          cb(null, `${(file.originalname)}`);
          //cb(null, `${uuid()}${extname(file.originalname)}`); <-- this if u want to rename
      },
  }),
};



@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiTags('product')
  @ApiOperation({ summary: 'API for create product' })
  @Post()
  create(@Body() productsDto: ProductsDto) {
    return this.productsService.create(productsDto);
  }

  @ApiTags('product')
  @ApiOperation({ summary: 'API for upload product' })
  @Post('upload')
  //@UseInterceptors(FileInterceptor('file', multerOptions))
  @UseInterceptors(FileInterceptor('file'))

  async uploadedFile(@UploadedFile() file) {
    if(file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    {

      //dari korea https://velog.io/@peter0618/NestJS-excel-%EC%97%85%EB%A1%9C%EB%93%9C%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      //const workbook = XLSX.read(file, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, {defval: null}); // default is "" if has blank values

      //Logger.debug(rows);

      for (const row of rows) {
        const values = Object.keys(row).map(key => row[key]);
        const [category, model, description] = values;
        values.push(this.productsService.upload(category, model, description))
        //Logger.debug(`category : ${category}, model : ${model}, description : ${description}`);
      }

      return {
        message: 'OK'
      }

    }else{
      return {
        message: 'Your file must follow our sample file'
      }
    }

  }

  @ApiTags('product')
  @ApiOperation({ summary: 'API for view category' })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiTags('product')
  @ApiOperation({ summary: 'API for view one product based on ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiTags('product')
  @ApiOperation({ summary: 'API for update product based on ID' })
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateProductsDto: UpdateProductsDto) {
    return this.productsService.update(id, updateProductsDto);
  }

}

