import { ProductGrade } from '../enums/ProductGrade';
import { Condition } from '../models/Condition';

export function isGreatDeal(
  productStatus: string,
  sellPrice: number,
  condition: Condition
): boolean {
  // Verify that the selling price of the item is 10% less than or
  // equal to the nudge price in the admin
  if (
    sellPrice <= Number(condition.like_new) * 0.9 &&
    (productStatus === ProductGrade.EXCELLENT ||
      productStatus === ProductGrade.LIKE_NEW)
  ) {
    return true;
  } else {
    return false;
  }
}
