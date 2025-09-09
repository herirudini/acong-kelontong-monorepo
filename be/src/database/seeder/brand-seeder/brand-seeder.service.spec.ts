import { Test, TestingModule } from '@nestjs/testing';
import { BrandSeederService } from './brand-seeder.service';

describe('BrandSeederService', () => {
  let service: BrandSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrandSeederService],
    }).compile();

    service = module.get<BrandSeederService>(BrandSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
