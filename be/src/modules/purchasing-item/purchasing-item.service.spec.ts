import { Test, TestingModule } from '@nestjs/testing';
import { PurchasingItemService } from './purchasing-item.service';

describe('PurchasingItemService', () => {
  let service: PurchasingItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchasingItemService],
    }).compile();

    service = module.get<PurchasingItemService>(PurchasingItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
