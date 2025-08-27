import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { getAttributes } from '../grpc/category';
import { Attribute } from '../grpc/proto/category.pb';
import { AttributeDocument } from '../models/Attribute';
import { BrandDocument } from '../models/Brand';
import { CategoryDocument } from '../models/Category';
import {
  ImportingVariant,
  ImportingVariantDocument,
  ImportingVariantInput,
} from '../models/ImportingVariant';
import { DeviceModelDocument } from '../models/Model';
import { MappingArray } from '../models/ProductVariantMap';
import { UpdateVariant } from '../models/UpdateVariant';
import { Variant, VariantDocument } from '../models/Variant';
import { BrandRepository } from '../repositories/brandRepository';
import { CategoryRepository } from '../repositories/categoryRepository';
import { ModelRepository } from '../repositories/modelRepository';
import { ProductRepository } from '../repositories/productRepository';
import { ProductVariantRepository } from '../repositories/productVariantRepository';
import { VariantRepository } from '../repositories/variantRepository';
import { lowerAndUnderscoreText, normalize } from '../util/common';

@Service()
export class VariantMigrationService {
  @Inject()
  error: ErrorResponseDto;

  @Inject()
  variantRepository: VariantRepository;

  @Inject()
  categoryRepository: CategoryRepository;

  @Inject()
  brandRepository: BrandRepository;

  @Inject()
  modelRepository: ModelRepository;

  @Inject()
  productVariantRepository: ProductVariantRepository;

  @Inject()
  productRepository: ProductRepository;

  async generateVariantData(numberOfRecords: number) {
    try {
      // Get all Categories
      const [cErr, allCategories] =
        await this.categoryRepository.getAllCategory();

      // Get all Brands
      const [bErr, allBrands] = await this.brandRepository.getAllBrands();

      // Get all Models
      const [mErr, allModels] = await this.modelRepository.getAllActive();

      // Get all Attributes
      const attributes = await getAttributes({
        size: 200,
        page: 1,
        search: '',
        optionsIncluded: true,
      });
      const allAttributes: AttributeDocument[] = attributes.attributes.map(
        (attribute: Attribute) => {
          return {
            attribute_name_ar: attribute.nameAr,
            attribute_name_en: attribute.nameEn,
            status: attribute.status,
            _id: attribute.id,
            options: attribute.options,
          } as unknown as AttributeDocument;
        }
      );
      if (cErr || bErr || mErr) return [true, 'Fails to load data'];

      const validVariantAttributes: string[] = [
        'screen_size',
        'features',
        'processor',
        'ram',
        'storage_memory',
        'generation',
        'connectivity',
        'capacity',
        'model_type',
        'color',
        'series',
        'chipset',
        'speed',
        'sub_brand',
        'camera_model',
        'resolution',
        'sensor_type',
        'iso',
        'continuous_shooting_rate',
        'video_resolution',
        'backlight',
        'speakers?',
        'monitor_type',
        'speaker_type',
        'router_type',
        'first_letter',
        'second_letter',
        'third_letter',
        'city',
        'neighborhood',
        'number_of_bedrooms',
        'number_of_bathrooms',
        'property_area',
        'car_model',
        'year',
        'cylinders',
        'engine_displacement',
        'drive',
        'fuel_type',
        'transmission',
        'vehicle_size_class',
        'electric_motor',
        'car_mileage',
      ];
      allAttributes.forEach((attribute: any) => {
        attribute.options = attribute?.options?.filter(
          (value: any, index: any, self: any) => {
            return (
              index ===
              self.findIndex(
                (t: any) => t?.nameEn?.toString() === value?.nameEn?.toString()
              )
            );
          }
        );
      });

      // Time start
      console.time('running migration');

      // Get all ImportingVariant
      const importingData: ImportingVariantDocument[] =
        await ImportingVariant.find({
          gen_variant_id: null,
          $or: [
            {
              is_valid_brand: true,
            },
            {
              is_valid_brand: null,
            },
          ],
        })
          .limit(numberOfRecords)
          .exec();
      // Loop through importingData
      const now = new Date();
      importingData.forEach(
        async (item: ImportingVariantDocument, index: number) => {
          // Get category ID by category name
          const catId = (allCategories.result as CategoryDocument[]).filter(
            cat =>
              (cat.category_name || '').trim() === (item.category || '').trim()
          )[0]?._id;

          if (!catId) {
            return [
              true,
              `Category ${item.category} not found at row ${index} `,
            ];
          }

          // Get brand ID by brand Name & category ID
          const brandId = (allBrands.result as BrandDocument[]).filter(
            brand =>
              (brand.brand_name || '').trim()?.toLowerCase() ===
                (item.brand || '').trim()?.toLowerCase() &&
              (brand.category_id || '').toString() === (catId || '').toString()
          )[0]?._id;

          if (!brandId) {
            item.is_valid_brand = false;
            item.updated_at = now;
            await item.save();
            return [true, `Brand ${item.brand} not found at row ${index} `];
          }

          // Get model ID by model name & brand ID & category ID
          const modelId = (allModels.result as DeviceModelDocument[]).filter(
            model =>
              (model.model_name || '').trim() === (item.model || '').trim() &&
              (model.category_id || '').toString() === catId.toString() &&
              (model.brand_id || '').toString() === brandId.toString()
          )[0]?._id;

          if (!modelId) {
            return [true, `Brand ${item.model} not found at row ${index} `];
          }
          // Find matched Attributes with the import data
          const matchedAttributes: any = [];
          const itemKey: any = Object.keys(item.toJSON());
          itemKey.forEach((key: any) => {
            if (validVariantAttributes.includes(key)) {
              allAttributes.forEach((attribute: any) => {
                if (
                  lowerAndUnderscoreText(key) ===
                  lowerAndUnderscoreText(attribute?.attribute_name_en)
                ) {
                  matchedAttributes.push(attribute);
                }
              });
            }
          });

          let matchedOptions: any = [];
          let variantName = '';
          let variantNameArabic = '';
          matchedAttributes.forEach((attribute: any) => {
            itemKey.forEach((key: any) => {
              if (
                lowerAndUnderscoreText(key) ===
                  lowerAndUnderscoreText(attribute.attribute_name_en) &&
                attribute.status === 'Active'
              ) {
                attribute?.options?.forEach((option: any) => {
                  if (
                    (item as any)[key]?.toLowerCase().trim() ===
                    option.nameEn?.toLowerCase().trim()
                  ) {
                    variantName +=
                      key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/_/g, ' ') +
                      ' ' +
                      option.nameEn.replace(/_/g, ' ') +
                      ', ';
                    variantNameArabic +=
                      attribute.attribute_name_ar + ' ' + option.nameAr + ', ';
                    matchedOptions.push({
                      feature_id: attribute._id,
                      attribute_id: option.id,
                    });
                  }
                });
              }
            });
          });

          variantName = [...new Set(variantName?.split(','))]
            .reduce((result, element) => {
              const normalizedElement = normalize(element);
              if (
                result.every(
                  otherElement => normalize(otherElement) !== normalizedElement
                )
              )
                result.push(element);

              return result;
            }, [])
            .toString();
          variantNameArabic = [...new Set(variantNameArabic?.split(','))]
            .reduce((result, element) => {
              const normalizedElement = normalize(element);
              if (
                result.every(
                  otherElement => normalize(otherElement) !== normalizedElement
                )
              )
                result.push(element);

              return result;
            }, [])
            .toString();
          matchedOptions = matchedOptions.filter(
            (value: any, index: any, self: any) =>
              index ===
              self.findIndex((t: any) => t.feature_id === value.feature_id)
          );

          // Find matched options in the matched attributes with the import data
          // Form an input
          const newVariant: ImportingVariantInput = {
            category_id: catId.toString(),
            brand_id: brandId.toString(),
            model_id: modelId.toString(),
            varient: variantName.trim().slice(0, -1),
            varient_ar: variantNameArabic.trim().slice(0, -1),
            current_price: Number(item.market_price),
            deleted_date: null,
            attributes:
              matchedOptions?.map((item: any) => {
                return {
                  feature_id: item.feature_id,
                  attribute_id: item.attribute_id,
                };
              }) || [],
          };

          const [vError, result] = await this.variantRepository.findAndUpsert(
            newVariant
          );
          if (!vError) {
            item.gen_variant_id = (result.result as VariantDocument)._id;
            item.updated_at = now;
            await item.save();
          } else {
            console.log('error when saving variant', newVariant);
          }

          // return item;
        }
      );
      // Time end
      console.timeEnd('running migration');

      return [false, 'Importing variant is done'];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MIGRATE_VARIANT_DATA,
          exception.message
        );
      }
    }
  }

  async mappingVariantOfProducts() {
    const [, data]: any = await this.productVariantRepository.getMappingArray();

    data.result?.map(async (mappingRow: MappingArray) => {
      await this.productRepository.modelVariantMigrate(
        mappingRow._id,
        mappingRow.model_id,
        mappingRow.new_model_id,
        mappingRow.old_variant_id,
        mappingRow.new_variant_id
      );
      const [, productIdsResult] =
        await this.productRepository.getProductIdsByMapId(mappingRow._id);
      await this.productVariantRepository.saveRelatedProduct(
        mappingRow._id,
        productIdsResult.result
      );
      await this.variantRepository.migrateModelId(
        mappingRow._id,
        mappingRow.model_id,
        mappingRow.new_model_id
      );
      const [, variantIdsResult] =
        await this.variantRepository.getVariantIdsByMapId(mappingRow._id);
      await this.productVariantRepository.saveRelatedVariants(
        mappingRow._id,
        variantIdsResult.result
      );
    });

    return 'Variant Model Mapping Done';
  }

  async deleteUnusedModels(): Promise<number> {
    // select model_id in varients
    const [error, inUsedModels] =
      await this.variantRepository.getModelsInUsedByVarients();
    if (error) {
      return 0;
    }
    const ids = (inUsedModels as { model_id: any }[]).map(
      (item: any) => item.model_id
    );
    if (ids.length) {
      // Delete all models that not in this inUsedModels
      const deletedCount = await this.modelRepository.softDeleteModels({
        _id: { $nin: ids },
      });

      return deletedCount;
    }

    return 0;
  }

  async deleteUnusedVariant(): Promise<number> {
    // select model_id in varients
    const unUsedVariant = await UpdateVariant.find({});
    unUsedVariant.map(async (data: any) => {
      await Variant.findByIdAndUpdate(data.variant_id, { status: 'Delete' });
    });

    return 0;
  }

  async cleanVariantMappingSheetData() {
    try {
      await this.productVariantRepository.cleanVariantMappingSheetData();
      return [false, 'Clean variant map data is done'];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MIGRATE_VARIANT_DATA,
          exception.message
        );
      }
    }
  }
}
