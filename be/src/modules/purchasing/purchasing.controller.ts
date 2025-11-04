import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PaginationDto } from 'src/global/global.dto';
import { BaseResponse } from 'src/utils/base-response';
import { PurchasingService } from './purchasing.service';
import type { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { PurchasingDto, PurchaseOrderDto, ReceiveOrderItemDto, ListPurchasingItemsDTO, PurchasingItemDto } from './purchasing.dto';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PurchasingEn } from './purchasing.schema';

@Controller('purchasing')
export class PurchasingController {

  constructor(
    private readonly service: PurchasingService,
  ) { }

  @Post('')
  @UseInterceptors(FileInterceptor('invoice_photo', {
    storage: diskStorage({
      destination: './uploads/invoices',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async createPurchasing(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: PurchasingDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      if (file) {
        const filePath = `/uploads/invoices/${file.filename}`;
        const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;
        dto.invoice_photo = fullUrl; // store full URL
      }
      const data: PurchasingDto & { status: PurchasingEn } = {
        ...dto,
        status: PurchasingEn.REQUEST
      }
      const purchasing = await this.service.createPurchasing(data);
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
  @UseInterceptors(FileInterceptor('invoice_photo', {
    storage: diskStorage({
      destination: './uploads/invoices',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async editPurchasing(
    @Param('purchasing_id') purchasingId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() dto: PurchasingDto,
    @Res() res: Response,
  ) {
    try {
      if (file) {
        const filePath = `/uploads/invoices/${file.filename}`;
        const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;
        dto.invoice_photo = fullUrl; // store full URL
      }
      const purchasing = await this.service.editPurchasing(purchasingId, dto);
      return BaseResponse.success({
        res,
        option: { message: 'Success edit purchasing', detail: purchasing },
      });
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

  @Put(':purchasing_id/process')
  @UseInterceptors(FileInterceptor('invoice_photo', {
    storage: diskStorage({
      destination: './uploads/invoices',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async purchaseOrder(
    @Param('purchasing_id') purchasingId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() dto: PurchaseOrderDto,
    @Res() res: Response,
  ) {
    try {
      if (file) {
        const filePath = `/uploads/invoices/${file.filename}`;
        const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;
        dto.invoice_photo = fullUrl; // store full URL
      }
      const purchasing = await this.service.purchaseOrder(purchasingId, dto);
      return BaseResponse.success({
        res,
        option: { message: `Success processing purchase order`, detail: purchasing },
      });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @Put(':purchasing_id/receive')
  @UseInterceptors(FileInterceptor('invoice_photo', {
    storage: diskStorage({
      destination: './uploads/invoices',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async recieveOrder(
    @Param('purchasing_id') purchasingId: Types.ObjectId,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() dto: PurchaseOrderDto & ReceiveOrderItemDto,
    @Res() res: Response,
  ) {
    try {
      if (file) {
        const filePath = `/uploads/invoices/${file.filename}`;
        const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;
        dto.invoice_photo = fullUrl; // store full URL
      }
      const purchasing = await this.service.receiveOrder(purchasingId, dto);
      return BaseResponse.success({
        res,
        option: { message: `Success receive purchase order`, detail: purchasing },
      });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @Get(':purchasing_id/items')
  async listPurchasingItem(
    @Query() query: ListPurchasingItemsDTO,
    @Param('purchasing_id') purchasingId: Types.ObjectId,
    @Res() res: Response,
  ) {
    try {
      query.purchasing_id = purchasingId;
      const { data, meta } = await this.service.listPurchasingItems(query);
      return BaseResponse.success({ res, option: { message: 'Success get list purchasing item', list: data, meta } });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }

  @Post(':purchasing_id/items')
  async purchasingItemBulkUpdate(
    @Body() body: PurchasingItemDto[],
    @Param('purchasing_id') purchasingId: Types.ObjectId,
    @Res() res: Response,
  ) {
    try {
      const { data, meta } = await this.service.bulkUpdatePurchasingItems(purchasingId, body);
      return BaseResponse.success({ res, option: { message: 'Success bulk update purchasing item', list: data, meta } });
    } catch (err) {
      return BaseResponse.error({ res, err });
    }
  }
}