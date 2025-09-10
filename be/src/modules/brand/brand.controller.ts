import { Body, Controller, Get, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Brand } from './brand.schema';
import { BrandService } from './brand.service';
import type { Request, Response } from 'express';

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
            return res.status(200).json({ success: true, message: 'Success create brand', detail: brand });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Create brand failed' });
        }
    }

    @Get('')
    async listBrand(
        @Query('search') search: string,
        @Res() res: Response,
    ) {
        try {
            const brands = await this.service.listBrand(search);
            return res.status(200).json({ success: true, message: 'Success list brand', list: brands });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'List brand failed' });
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
            return res.status(200).json({ success: true, message: 'Success edit brand', detail: brand });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Edit brand failed' });
        }
    }

    @Get(':brand_id')
    async detailBrand(
        @Param('brand_id') brandId: string,
        @Res() res: Response,
    ) {
        try {
            const brand = await this.service.detailBrand(brandId);
            return res.status(200).json({ success: true, message: 'Success get detail brand', detail: brand });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Get detail brand failed' });
        }
    }
}
