import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Brand } from './brand.schema';
import { BrandService } from './brand.service';
import type { Request, Response } from 'express';
import { BaseResponse } from 'src/utils/base-response';

@UseGuards(AuthGuard)
@Controller('brand')
export class BrandController {
    constructor(
        private readonly service: BrandService,
    ) { }

    @Post('')
    async createBrand(
        @Req() req: Request,
        @Body() body: Brand,
        @Res() res: Response,
    ) {
        try {
            const brand = await this.service.createBrand(body);
            return BaseResponse.success({ res, option: { message: "Success create brand", detail: brand } });
        } catch (err) {
            return BaseResponse.error({ res, err });
        }
    }

    @Get('')
    async listBrand(
        @Query('search') search: string,
        @Res() res: Response,
    ) {
        try {
            const brands = await this.service.listBrand(search);
            return BaseResponse.success({ res, option: { message: 'Success list brand', list: brands } });
        } catch (err) {
            return BaseResponse.error({ res, err });
        }
    }

    @Put(':brand_id')
    async editBrand(
        @Param('brand_id') brandId: string,
        @Body() body: Brand,
        @Res() res: Response,
    ) {
        try {
            const brand = await this.service.editBrand(brandId, body);
            return BaseResponse.success({ res, option: { message: "Success edit brand", detail: brand } });
        } catch (err) {
            return BaseResponse.error({ res, err });
        }
    }

    @Get(':brand_id')
    async detailBrand(
        @Param('brand_id') brandId: string,
        @Res() res: Response,
    ) {
        try {
            const brand = await this.service.detailBrand(brandId);
            return BaseResponse.success({ res, option: { message: "Success get detail brand", detail: brand } });
        } catch (err) {
            return BaseResponse.error({ res, err });
        }
    }
}
