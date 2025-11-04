import { Test, TestingModule } from '@nestjs/testing';
import { PurchasingItemController } from './purchasing-item.controller';

describe('PurchasingItemController', () => {
  let controller: PurchasingItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasingItemController],
    }).compile();

    controller = module.get<PurchasingItemController>(PurchasingItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
