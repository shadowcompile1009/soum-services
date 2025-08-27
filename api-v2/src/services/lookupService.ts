import { Container, Service } from 'typedi';
import { CategoryDocument } from '../models/Category';
import { GetLookUpDto } from '../dto/lookupDto';
import { BrandDocument } from '../models/Brand';
import { DeviceModelDocument } from '../models/Model';
import { CategoryService } from './categoryService';
import { BrandService } from './brandService';
import { ModelService } from './modelService';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { setCache } from '../libs/redis';
import { DeltaMachineService } from './deltaMachineService';
import { DMStatusLookUpDto } from '../dto/DMStatusLookUpDto';
@Service()
export class LookupService {
  deltaMachineService: DeltaMachineService;
  categoryService: CategoryService;
  brandService: BrandService;
  modelService: ModelService;
  error: ErrorResponseDto;

  constructor() {
    this.deltaMachineService = Container.get(DeltaMachineService);
    this.categoryService = Container.get(CategoryService);
    this.brandService = Container.get(BrandService);
    this.modelService = Container.get(ModelService);
    this.error = Container.get(ErrorResponseDto);
  }

  cashAllLookups = async () => {
    const result = {
      categories: await this.getAllCategories(),
      brands: await this.getAllBrands(),
      models: await this.getAllModels(),
      dmOrderStatus: await this.getAllDMStatus(),
    };
    await setCache(`${process.env.REDIS_ENV}_lookups`, result, 60 * 60);
    return result;
  };

  getAllDMStatus = async () => {
    const result = await this.deltaMachineService.getStatusList();
    return ((result as any[]) || []).map(
      elem =>
        ({
          id: elem.id,
          name: elem.name,
          displayName: elem.displayName,
        } as DMStatusLookUpDto)
    );
  };
  getAllCategories = async () => {
    const result = await this.categoryService.getAllCategory(null);
    return ((result as CategoryDocument[]) || []).map(
      elem =>
        ({
          id: elem._id,
          arName: elem.category_name_ar,
          enName: elem.category_name,
        } as GetLookUpDto)
    );
  };

  getAllBrands = async () => {
    const result = await this.brandService.getAllBrands();
    return ((result as BrandDocument[]) || []).map(
      elem =>
        ({
          id: elem._id,
          arName: elem.brand_name_ar,
          enName: elem.brand_name,
        } as GetLookUpDto)
    );
  };

  getAllModels = async () => {
    const result = await this.modelService.getAllModels();
    return ((result as DeviceModelDocument[]) || []).map(
      elem =>
        ({
          id: elem._id,
          arName: elem.model_name_ar,
          enName: elem.model_name,
        } as GetLookUpDto)
    );
  };
}
