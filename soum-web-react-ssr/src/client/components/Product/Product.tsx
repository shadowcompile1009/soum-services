import { Attribute } from "@declarations/attribute/attribute.type";
import { Condition } from "@declarations/condition/condition.type";
import { SellerCity } from "@declarations/seller.city/seller.city.type";
import { useLocale } from "@hooks/useLocale";
import { getCloudImageUrl } from "@utils/cloudimage/cloudimage";
import React, { JSX } from "react";
import { Link } from "react-router-dom";

export type ProductProps = {
  categoryName?: string;
  originalPrice: number;
  modelName: string;
  arModelName: string;
  productId: string;
  sellPrice: number;
  productImage: string;
  discount?: number;
  attributes?: Attribute[];
  productImages: string[];
  condition?: Condition;
  tags: string;
  sellStatus?: string;
  sellDate?: string;
  brandName?: string;
  variantName?: string;
  isSlideble?: boolean;
  isHomepage?: boolean;
  expressDeliveryBadge?: boolean;
  sellerCity?: SellerCity;
  usage?: "mpp" | "homepage" | "collection";
};

export const Product = (props: ProductProps): JSX.Element => {
  const { language } = useLocale();

  const isProductSold = props.sellStatus === "Sold";

  const productTitle = language == "ar" ? props.arModelName : props.modelName;

  const attributes = props.attributes?.map((attribute) => {
    return language == "ar" ? attribute.value.arName : attribute.value.enName;
  });

  const productHasInstallments = props.sellPrice < 5000;

  return (
    <a lang={language} href="/blog" aria-label={productTitle}>
      <div className="flex flex-col gap-5 w-56 md:w-80">
        <img
          alt=""
          src={getCloudImageUrl(props.productImages[0])}
          className="w-full h-48 md:h-72 object-cover rounded-lg"
          loading="lazy"
        />
        <div className="w-full flex flex-col gap-3">
          <h3 className="font-bold text-2xl line-clamp-1">{productTitle}</h3>
          {!!attributes?.length && (
            <h4 className="font-normal text-base text-gray-600">
              {attributes.join(", ")}
            </h4>
          )}
          <h2 className="flex flex-row items-start gap-3">
            <span className="text-xl font-semibold">
              {new Intl.NumberFormat().format(props.sellPrice)}
            </span>
            <span className="text-sm font-normal">riyal</span>
          </h2>
          {productHasInstallments && (
            <h2 className="flex flex-row gap-3 items-center text-sm flex-wrap">
              <span className="font-semibold">
                {Number(props.sellPrice / 4).toFixed(2)} SAR / Month
              </span>
              <span className="text-gray-600">With</span>
              <div className="flex flex-row gap-1">
                <img
                  height={10}
                  width={50}
                  src={getCloudImageUrl("/tabby-icon.png")}
                  loading="lazy"
                  className="object-contain"
                />
                <img
                  height={10}
                  width={50}
                  src={getCloudImageUrl(`/tamara-${language}-icon.png`)}
                  loading="lazy"
                  className="object-contain"
                />
              </div>
            </h2>
          )}
          <div className="flex flex-row gap-3">
            {props.condition && (
              <h2
                style={{
                  backgroundColor: props.condition.labelColor,
                  color: props.condition.textColor,
                }}
                className="py-4 px-2"
              >
                {language == "ar"
                  ? props.condition.nameAr
                  : props.condition.name}
              </h2>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};
