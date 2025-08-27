import { AttributeDocument } from '../../src/models/Attribute';
import { AttributeRepository } from '../../src/repositories/attributeRepository';
import { VariantRepository } from '../../src/repositories/variantRepository';
import { VariantService } from '../../src/services/variantService';
import {
  getAllAttributes,
  getVariantWithAttribute,
  getVariantWithManyAttributes,
  getVariantWithAttributeNumber,
  getVariantWithoutConditions,
} from '../_data/variants';
import {
  getVariantByIdWithOneAttribute,
  getVariantByIdWithManyAttributes,
  getVariantByIdWithAttributeNumber,
  getVariantByIdWithoutConditions,
} from '../_data/model';

jest.mock('../../src/repositories/variantRepository', () => {
  return {
    _esModule: true,
    VariantRepository: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

jest.mock('../../src/repositories/attributeRepository', () => {
  return {
    _esModule: true,
    AttributeRepository: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

describe('getVariantViaId', () => {
  beforeAll(() => {});

  test('when providing variant with one attribute, return a data with price ranges matched conditions', async () => {
    const variantRepository = new VariantRepository();

    variantRepository.getByIdWithPriceNudge = jest.fn(() =>
      Promise.resolve(
        getVariantWithAttribute as [
          boolean,
          { code: number; result: any | string; message?: string }
        ]
      )
    );

    const attributeRepository = new AttributeRepository();
    attributeRepository.getAllAttribute = jest.fn(() =>
      Promise.resolve(
        getAllAttributes as [
          boolean,
          {
            code: number;
            result: AttributeDocument[] | string;
            message?: string;
          }
        ]
      )
    );

    const variantService = new VariantService();
    variantService.variantRepository = variantRepository;
    variantService.attributeRepository = attributeRepository;

    const result = await variantService.getVariantViaId(
      '632b378ff49ff67c8b3ff43b'
    );
    expect(result).toEqual(getVariantByIdWithOneAttribute);
  });

  test('when providing variant with many attributes, return a data with price ranges matched conditions', async () => {
    const variantRepository = new VariantRepository();

    variantRepository.getByIdWithPriceNudge = jest.fn(() =>
      Promise.resolve(
        getVariantWithManyAttributes as [
          boolean,
          { code: number; result: any | string; message?: string }
        ]
      )
    );

    const attributeRepository = new AttributeRepository();
    attributeRepository.getAllAttribute = jest.fn(() =>
      Promise.resolve(
        getAllAttributes as [
          boolean,
          {
            code: number;
            result: AttributeDocument[] | string;
            message?: string;
          }
        ]
      )
    );

    const variantService = new VariantService();
    variantService.variantRepository = variantRepository;
    variantService.attributeRepository = attributeRepository;

    const result = await variantService.getVariantViaId(
      '6339ab448350a5333b409e5f'
    );
    expect(result).toEqual(getVariantByIdWithManyAttributes);
  });

  test(
    'when providing variant with attribute beginning number (128Gb, 1TB, ...),' +
      'return a data with an empty array of attributes and a price ranges matched conditions',
    async () => {
      const variantRepository = new VariantRepository();

      variantRepository.getByIdWithPriceNudge = jest.fn(() =>
        Promise.resolve(
          getVariantWithAttributeNumber as [
            boolean,
            { code: number; result: any | string; message?: string }
          ]
        )
      );

      const attributeRepository = new AttributeRepository();
      attributeRepository.getAllAttribute = jest.fn(() =>
        Promise.resolve(
          getAllAttributes as [
            boolean,
            {
              code: number;
              result: AttributeDocument[] | string;
              message?: string;
            }
          ]
        )
      );

      const variantService = new VariantService();
      variantService.variantRepository = variantRepository;
      variantService.attributeRepository = attributeRepository;

      const result = await variantService.getVariantViaId(
        '6151b81939b100d6a1143a40'
      );
      expect(result).toEqual(getVariantByIdWithAttributeNumber);
    }
  );

  test('when providing variant without conditions return a data with an empty array of price ranges', async () => {
    const variantRepository = new VariantRepository();

    variantRepository.getByIdWithPriceNudge = jest.fn(() =>
      Promise.resolve(
        getVariantWithoutConditions as [
          boolean,
          { code: number; result: any | string; message?: string }
        ]
      )
    );

    const attributeRepository = new AttributeRepository();
    attributeRepository.getAllAttribute = jest.fn(() =>
      Promise.resolve(
        getAllAttributes as [
          boolean,
          {
            code: number;
            result: AttributeDocument[] | string;
            message?: string;
          }
        ]
      )
    );

    const variantService = new VariantService();
    variantService.variantRepository = variantRepository;
    variantService.attributeRepository = attributeRepository;

    const result = await variantService.getVariantViaId(
      '632b378ff49ff67c8b3ffe93'
    );
    expect(result).toEqual(getVariantByIdWithoutConditions);
  });

  test('when providing non-existed ID, throw an error response', async () => {
    try {
      const variantRepository = new VariantRepository();

      variantRepository.getByIdWithPriceNudge = jest.fn(() =>
        Promise.resolve([] as any)
      );

      const attributeRepository = new AttributeRepository();
      attributeRepository.getAllAttribute = jest.fn(() =>
        Promise.resolve(
          getAllAttributes as [
            boolean,
            {
              code: number;
              result: AttributeDocument[] | string;
              message?: string;
            }
          ]
        )
      );

      const variantService = new VariantService();
      variantService.variantRepository = variantRepository;
      variantService.attributeRepository = attributeRepository;

      await variantService.getVariantViaId('123456789123456789123456');
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error.resData).toBe(undefined);
      expect(error.errorDetail).toBe(
        "Cannot read properties of undefined (reading 'result')"
      );
      expect(error.errorCode).toBe(400);
    }
  });
});
