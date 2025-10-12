import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier, SupplierDocument } from 'src/modules/supplier/supplier.schema';

@Injectable()
export class SupplierSeederService {
  private readonly logger = new Logger(SupplierSeederService.name);

  constructor(
    @InjectModel(Supplier.name) private readonly brandModel: Model<SupplierDocument>,
  ) { }

  async run() {
    const seedData = [
      {
        supplier_name: 'PT Indofood Sukses',
        supplier_email: 'sukses@mail.mail',
        supplier_contact: '089089089089',
      },
      {
        supplier_name: 'PT Tirta Investama',
        supplier_email: 'investama@mail.mail',
        supplier_contact: '089089089089',

      },
      {
        supplier_name: 'Ultra Milk',
        supplier_email: 'milk@mail.mail',
        supplier_contact: '089089089089',

      }
    ];

    for (const supplier of seedData) {
      await this.brandModel.updateOne(
        { supplier_name: supplier.supplier_name }, // lookup
        { $set: supplier },                  // update data
        { upsert: true },                 // insert if not exists
      );
      console.info(`🚀 Seeded supplier: ${supplier.supplier_name}`);
    }
  }
}
