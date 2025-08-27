export type Category = {
  category_name: string;
  category_name_ar: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  mini_category_icon: string;
};

export type FetchCategoriesResponse = {
  responseData: Category[];
};
