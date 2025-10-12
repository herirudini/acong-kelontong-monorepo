import { Test, TestingModule } from '@nestjs/testing';
import { SupplierSeederService } from './supplier-seeder.service';

describe('SupplierSeederService', () => {
  let service: SupplierSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplierSeederService],
    }).compile();

    service = module.get<SupplierSeederService>(SupplierSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
