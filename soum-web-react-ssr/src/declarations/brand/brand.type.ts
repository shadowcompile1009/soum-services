export type Brand = {
  status: string;
  position: number;
  _id: string;
  brand_name_ar: string;
  created_at: string;
  updated_at: string;
  category_id: string;
  brand_name: string;
  brand_icon: string;
};

export type FetchBrandsResponse = {
  responseData: Brand[];
};
