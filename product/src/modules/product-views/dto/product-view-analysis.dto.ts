import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class ProductViewerDto {
  @IsMongoId()
  @IsOptional()
  productId: string;
}
export class ProductViewerSPPDto {
  @IsArray()
  @IsOptional()
  @Type(() => IsMongoId())
  productIds: string[];
}
export class ProductViewerClickCloudFuncDto {
  @IsMongoId()
  productId: string;
  @IsNumber()
  clickedBuyNow: number;
  @IsNumber()
  sppViewed: number;

}
export class ProductViewAnalysisDto {
  @IsNumber()
  @IsOptional()
  public viewCount = 0;
  @IsNumber()
  @IsOptional()
  public buyNowClickCount = 0;
  @IsMongoId()
  @IsOptional()
  productId: string;
}
export class ProductMarketPriceDto {
  @IsNumber()
  @IsOptional()
  public price = 0;
  @IsMongoId()
  productId: string;
}