import { Container } from 'typedi';
import { getMultipleAttribute } from '../grpc/category';
import { Attribute, GetAttributesResponse } from '../grpc/proto/category.pb';
import { Option } from '../grpc/proto/category/Option';
import { AttributeVariantDocument } from '../models/Variant';
import { AttributeService } from '../services/attributeService';

interface INamePair {
  arName: string;
  enName: string;
}

export interface IMappedAttribute {
  title: INamePair;
  value: INamePair;
  positionAr?: number;
  positionEn?: number;
  iconURL?: string;
}

export const mapAttributes = async (
  attributes: AttributeVariantDocument[],
  prefetchedAllAttributes?: GetAttributesResponse
): Promise<IMappedAttribute[]> => {
  const attributeService = Container.get(AttributeService);
  const allAttributes = prefetchedAllAttributes
    ? prefetchedAllAttributes
    : await attributeService.getAllAttributes('', true, 1, 200);

  if (!(allAttributes as GetAttributesResponse).attributes) {
    return null;
  }

  const attributeMap = new Map<string, Attribute>();
  const optionMap = new Map<string, Option>();

  (allAttributes as GetAttributesResponse).attributes?.forEach(
    (attribute: Attribute) => {
      attributeMap.set(attribute.id.toString(), attribute);
      attribute.options?.forEach((option: Option) => {
        optionMap.set(option.id.toString(), option);
      });
    }
  );

  const test = attributes.map((item: AttributeVariantDocument) => {
    const response = attributeMap.get(item.feature_id.toString());
    const option = optionMap.get(item.attribute_id.toString());

    if (response) {
      return {
        title: {
          arName: response.nameAr || '',
          enName: response.nameEn || '',
        },
        value: {
          arName: option?.nameAr || '',
          enName: option?.nameEn || '',
        },
        positionAr: option?.positionAr || 100000,
        positionEn: option?.positionEn || 100000,
        iconURL: response.iconURL || '',
      };
    }
    return null;
  });
  return test.filter(result => result !== null) as IMappedAttribute[];
};

export const mapMultipleAttributes = async (
  attributes: AttributeVariantDocument[]
): Promise<Record<string, IMappedAttribute>> => {
  const ids = attributes.map(attribute => attribute.feature_id);
  const attributeResponse = await getMultipleAttribute({
    ids: [...new Set(ids)],
  });
  const fetchedAttributes = attributeResponse.attributes;

  let featureIdAttributeMap: Record<any, any> = {};
  fetchedAttributes.forEach(attribute => {
    featureIdAttributeMap = {
      ...featureIdAttributeMap,
      [attribute.id]: attribute,
    };
  });

  let result: Record<string, IMappedAttribute> = {};

  attributes.forEach(attribute => {
    const currentAttribute = featureIdAttributeMap[attribute.feature_id];

    if (!currentAttribute) {
      result = {
        ...result,
        [attribute._id]: null,
      };
      return null;
    }
    const option = currentAttribute?.options?.find(
      (option: Option) =>
        option?.id?.toString() === attribute?.attribute_id?.toString()
    );
    if (option?.nameEn == '-' || option?.nameEn == '') {
      result = {
        ...result,
        [attribute._id]: null,
      };
      return null;
    }
    result = {
      ...result,
      [attribute._id]: {
        title: {
          arName: currentAttribute?.nameAr || '',
          enName: currentAttribute?.nameEn || '',
        },
        value: {
          arName: option?.nameAr || '',
          enName: option?.nameEn || '',
        },
      },
    };
  });
  return result;
};
