const BASE_URL = `${process.env.NEXT_PUBLIC_API_GATEWAY!}commission`;

const PromocodeEndpoints = {
  getPromocodeList: (
    limit: number,
    page: number,
    search: string = '',
    id?: string | undefined
  ) => {
    const baseUrl = `${BASE_URL}/promo-codes?page=${page}&limit=${limit}`;
    const params = new URLSearchParams();

    if (search) {
      params.append('searchValue', search);
    }

    if (id && id.trim()) {
      params.append('parentPromoCodeId', id);
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}&${queryString}` : baseUrl;
  },
  updateStatus: (id: string) => {
    return `${BASE_URL}/promo-codes/${id}`;
  },
  createEdit: (id?: string) => {
    return id ? `${BASE_URL}/promo-codes/${id}` : `${BASE_URL}/promo-codes`;
  },
  deletePromocode: (id: string) => {
    return `${BASE_URL}/promo-codes/${id}`;
  },
};

interface IPromoCode {
  availablePayment: any[];
  code: string;
  createdDate: string;
  discount: number;
  excludedPromoCodeScope: any[];
  fromDate: string;
  id: string;
  isDefault: boolean;
  netRemainingCredit: number;
  percentage: number | null;
  promoBuyerUsageCount: number;
  promoCodeScope: any[];
  promoGenerator: string;
  promoSellerUsageCount: number;
  promoType: string;
  status: string;
  toDate: string;
  totalGainedCredit: number;
  totalReimburseCredit: number;
  totalUsage: number;
  updatedDate: string;
  userType: string;
}

export class Promocode implements IPromoCode {
  availablePayment: any[] = [];
  code: string = '';
  createdDate: string = '';
  discount: number = 0;
  excludedPromoCodeScope: any[] = [];
  fromDate: string = '';
  id: string = '';
  isDefault: boolean = false;
  netRemainingCredit: number = 0;
  percentage: number | null = null;
  promoBuyerUsageCount: number = 0;
  promoCodeScope: any[] = [];
  promoGenerator: string = '';
  promoSellerUsageCount: number = 0;
  promoType: string = '';
  status: string = '';
  toDate: string = '';
  totalGainedCredit: number = 0;
  totalReimburseCredit: number = 0;
  totalUsage: number = 0;
  updatedDate: string = '';
  userType: string = '';
  totalCodes: number = 0;
  note: string = '';
  totalAllowedUsage: number = 0;
  promoLimit: number = 0;
  bulkPrefix?: string = '';
  parentPromoCodeId?: string = '';

  constructor(data: Partial<IPromoCode> = {}) {
    Object.assign(this, data);
  }

  static async getPromocodeList(
    limit: number,
    page: number,
    search: string,
    id: string = ''
  ) {
    const response = await fetch(
      PromocodeEndpoints.getPromocodeList(limit, page, search, id)
    );
    const data = await response.json();
    return data;
  }

  static async deletePromocode(id: string) {
    const response = await fetch(PromocodeEndpoints.deletePromocode(id), {
      method: 'DELETE',
    });
    return await response.json();
  }

  static async updateStatus({
    promocode,
    status,
  }: {
    promocode: Promocode;
    status: string;
  }) {
    const endpoint = PromocodeEndpoints.updateStatus(promocode?.id);
    const data = { ...promocode, status };
    const payload = Object.fromEntries(
      Object.entries(data).filter(([key]) => key !== 'bulkPrefix')
    );

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  }

  static async createEdit(data: Partial<Promocode>, id?: string) {
    const endpoint = PromocodeEndpoints.createEdit(id);
    const response = await fetch(endpoint, {
      method: id ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    if (!response.ok) {
      throw { response: { data: responseData, status: response.status } };
    }
    return responseData;
  }
}
