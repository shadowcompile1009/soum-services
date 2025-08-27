import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import awsConfig from '@src/config/aws.config';
import { ImageSectionService } from '../image-section/image-section.service';
import { ProductImageSectionDto } from './dto/productImages.dto';
import { ProductImageSection } from './entity/productImageSection.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImageSection)
    private readonly repo: EntityRepository<ProductImageSection>,
    private imageSectionService: ImageSectionService,
    @Inject(awsConfig.KEY)
    private readonly awsConfigData: ConfigType<typeof awsConfig>,
  ) {}

  async updateList(productImageSections: ProductImageSectionDto[]) {
    return Promise.all(
      productImageSections.map(async (element) => {
        let data = await this.repo.findOne({
          id: element.id,
        });
        if (data) {
          data.urls = element.urls;
          data = await this.repo.upsert(data);
        }
        return data;
      }),
    );
  }

  async createList(productImageSections: ProductImageSectionDto[]) {
    return this.repo
      .getEntityManager()
      .insertMany<ProductImageSection>(
        ProductImageSection,
        productImageSections,
      );
  }

  async getProductImages(productId: string) {
    const sections = await this.repo.find(
      { productId },
      { orderBy: [{ position: 1 }] },
    );
    return sections || [];
  }
  async getListOfProductImagesSections(productIds: string[]) {
    const sections = await this.repo.find(
      { productId: { $in: productIds } },
      { orderBy: [{ position: 1 }] },
    );
    return sections || [];
  }

  async createListForProduct(
    productImageSections: ProductImageSectionDto[],
    productId: string,
    categoryId: string,
  ) {
    const activeSections = await this.imageSectionService.filter(
      { categoryId: categoryId },
      100,
      0,
    );
    const newSections = [];
    activeSections.items.forEach((activeSec) => {
      const productImageSecDto = productImageSections.find(
        (elem) => elem.sectionId === activeSec.id,
      );
      if (productImageSecDto) {
        const productImageSec = {
          id: null,
          description: activeSec.description,
          descriptionAr: activeSec.descriptionAr,
          sectionType: activeSec.sectionType || null,
          sectionTypeAr: activeSec.sectionTypeAr || null,
          header: activeSec.header,
          headerAr: activeSec.headerAr,
          maxImageCount: activeSec.maxImageCount,
          minImageCount: activeSec.minImageCount,
          position: activeSec.position,
          urls: productImageSecDto.urls.map((elem) => {
            elem.base = this.awsConfigData.imageBucketEndpoint;
            return elem;
          }),
          productId: productId,
          iconURL: activeSec.iconURL,
          base: activeSec.base,
        } as ProductImageSection;
        newSections.push(this.repo.create(productImageSec));
      }
    });

    await this.repo.getEntityManager().persistAndFlush(newSections);
    return newSections;
  }

  async migrateProductImages(
    imagesUrl: string[],
    productId: string,
    categoryId?: string,
    productImgSections?: ProductImageSectionDto[],
  ) {
    if (categoryId && productImgSections) {
      await this.createListForProduct(
        productImgSections,
        productId,
        categoryId,
      );
      return [];
    }

    let productImageSec = {
      id: null,
      description: 'Upload clear images that reflect all product angles',
      descriptionAr: 'قم برفع صور واضحة للمنتج من جميع الزوايا',
      header: 'Product Images',
      headerAr: 'صور المنتج',
      maxImageCount: Math.max(imagesUrl.length, 9),
      minImageCount: 3,
      position: 0,
      urls: imagesUrl.map((elem) => {
        const base = `https://${new URL(elem).hostname}`;
        const relativePath = new URL(elem).pathname?.substring(1);
        return {
          base,
          relativePath,
        };
      }),
      productId: productId,
      iconURL: 'icons/listing/gallery.png',
      base: 'https://cdn.soum.sa',
    } as ProductImageSection;
    productImageSec = this.repo.create(productImageSec);
    await this.repo.getEntityManager().persistAndFlush([productImageSec]);
    return [productImageSec];
  }

  async getMappingImagesUploadForBulkListing(
    productImageSections: ProductImageSectionDto[],
    categoryId: string,
  ) {
    const activeSections = await this.imageSectionService.filter(
      { categoryId: categoryId },
      100,
      0,
    );
    const newSections = [];
    activeSections?.items?.forEach((activeSec) => {
      const productImageSecDto = productImageSections.find(
        (elem) => elem.sectionId === activeSec.id,
      );
      if (!productImageSecDto) return;

      const urls = productImageSecDto.urls.map((elem) => ({
        ...elem,
        base: this.awsConfigData.imageBucketEndpoint,
      }));

      newSections.push(...urls);
    });
    return newSections?.map((elem) => `${elem.base}/${elem.relativePath}`);
  }
}
