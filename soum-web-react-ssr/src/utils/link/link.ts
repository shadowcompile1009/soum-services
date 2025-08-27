import { Category } from "@declarations/category/category.type";
import { HomepageDataBanner } from "@declarations/homepage/homepage.type";

export const createSafeUrl = (url: string): string => {
  return url
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s/-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/\/+/g, "-")
    .replace(/-$/, "");
};

const hasArabicText = (value: string): boolean => {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  return arabicPattern.test(value);
};

const joinArabicAndEnglistStringsSafely = (
  segments: string[],
  joiner: string = "-"
): string => {
  const { english, arabic } = segments.reduce(
    (previous, current) => {
      if (hasArabicText(current)) {
        previous.arabic.push(current);
      } else {
        previous.english.push(current);
      }
      return previous;
    },
    {
      english: [],
      arabic: [],
    } as { english: string[]; arabic: string[] }
  );

  return [...english, ...arabic].join(joiner);
};

export const getBannerLink = (language: string, banner: HomepageDataBanner) => {
  return `${language == "ar" ? "" : `/${language}`}/collection/${createSafeUrl(
    joinArabicAndEnglistStringsSafely([banner.bannerName, banner.id])
  )}`;
};

export const getCategoryLink = (language: string, category: Category) => {
  return `${language == "ar" ? "" : `/${language}`}/category/${createSafeUrl(
    language == "ar" ? category.category_name_ar : category.category_name
  )}`;
};

export const getPageLink = (language: string, link: string) => {
  if (language == "ar") {
    return link;
  }

  return `/${language}${link == "/" ? "" : link}`;
};
