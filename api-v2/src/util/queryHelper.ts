export function lookup(
  from: string,
  localField: string,
  foreignField: string,
  as: string
): Record<string, any> {
  return {
    $lookup: {
      from: from,
      localField: localField,
      foreignField: foreignField,
      as: as,
    },
  };
}

export function unwind(
  path: string,
  preserveNullAndEmptyArrays: boolean = false
): Record<string, any> {
  return {
    $unwind: {
      path: path,
      preserveNullAndEmptyArrays: preserveNullAndEmptyArrays,
    },
  };
}

export function errorTemplate(
  code: number,
  result: string,
  message?: string
): [
  boolean,
  {
    code: number;
    result: any;
    message?: string;
  }
] {
  return [
    true,
    {
      code: code,
      result: result,
      message: message,
    },
  ];
}

export function returnedDataTemplate(
  code: number,
  result: any,
  message?: string,
  total?: number,
  limit?: number,
  offset?: number
): [
  boolean,
  {
    code: number;
    result: any;
    message?: string;
    total?: number;
    limit?: number;
    offset?: number;
  }
] {
  return [
    false,
    {
      code: code,
      result: result,
      message: message,
      total: total,
      limit: limit,
      offset: offset,
    },
  ];
}

export function calculateMismatchedDiscount(
  sellPrice: string,
  currentPrice: string
): Record<string, any> {
  return {
    $addFields: {
      discount: {
        $round: [
          {
            $subtract: [
              100,
              {
                $divide: [
                  {
                    $multiply: [100, sellPrice],
                  },
                  { $cond: [{ $eq: [currentPrice, 0] }, 1, currentPrice] },
                ],
              },
            ],
          },
          2,
        ],
      },
    },
  };
}
