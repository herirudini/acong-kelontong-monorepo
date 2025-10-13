import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PaginationDto } from 'src/global/global.dto';
import { BaseResponse } from 'src/utils/base-response';
import { Purchasing } from './purchasing.schema';
import { PurchasingService } from './purchasing.service';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { PurchasingMutationDTO } from './purchasing.dto';
import { Types } from 'mongoose';

@Controller('purchasing')
export class PurchasingController {

  constructor(
    private readonly service: PurchasingService,
  ) { }

  @Post('')
  async createPurchasing(
    @Body() dto: PurchasingMutationDTO,
    @Res() res: Response,
  ) {
    try {
      const purchasing = await this.service.createPurchasing(dto);
      return BaseResponse.success({ res, option: { message: "Success create purchasing", detail: purchasing } });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @Get('')
  async listPurchasing(
    @Query() query: PaginationDto,
    @Res() res: Response,
  ) {
    try {
      const { data, meta } = await this.service.listPurchasing(query);
      return BaseResponse.success({ res, option: { message: 'Success get list purchasing', list: data, meta } });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @Put(':purchasing_id')
  @UseInterceptors(FileInterceptor('invoice_photo'))
  async editPurchasing(
    @Param('purchasing_id') purchasingId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: PurchasingMutationDTO,
    @Res() res: Response,
  ) {
    try {
      dto.invoice_photo = file?.filename;
      const purchasing = await this.service.editPurchasing(purchasingId, dto);
      return BaseResponse.success({ res, option: { message: "Success edit purchasing", detail: purchasing } });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @Get(':purchasing_id')
  async detailPurchasing(
    @Param('purchasing_id') purchasingId: Types.ObjectId,
    @Res() res: Response,
  ) {
    try {
      const purchasing = await this.service.detailPurchasing(purchasingId);
      return BaseResponse.success({ res, option: { message: "Success get detail purchasing", detail: purchasing } });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }


  @Delete(':purchasing_id')
  async deletePurchasing(
    @Param('purchasing_id') purchasingId: Types.ObjectId,
    @Res() res: Response,
  ) {
    try {
      const purchasing = await this.service.deletePurchasing(purchasingId);
      return BaseResponse.success({ res, option: { message: "Success get detail purchasing", detail: purchasing } });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }
}

