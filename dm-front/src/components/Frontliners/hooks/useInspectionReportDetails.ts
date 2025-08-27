import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/queryKeys';
import { ProductListing } from '@/models/ProductListing';

export function useInspectionReportDetails(listingId: string, categoryName: string) {
  const id = String(listingId);
  return useQuery([QUERY_KEYS.inspectionReportDetails, id], () =>
    ProductListing.getInspectionReportDetailsById(id, categoryName)
  );
}

export function useRealEstateInspectionReportDetails(listingId: string) {
  const id = String(listingId);
  return useQuery([QUERY_KEYS.realEstateInspectionReportDetails, id], () =>
    ProductListing.getRealEstateInspectionReportDetailsById(id)
  );
}
