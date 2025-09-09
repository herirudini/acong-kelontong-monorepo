import { Body, Controller, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
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
            return res.status(200).json({ success: true, message: 'Success create brand', brand });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Create brand failed' });
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
            return res.status(200).json({ success: true, message: 'Success create brand', brand });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Create brand failed' });
        }
    }
}
