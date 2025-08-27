import { OfferSummary } from '../schema/offer.schema';

export class UserOffer {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  sellPrice: number;
  status: string;
  offerSummary: OfferSummary;
  createdAt: Date;
  updatedAt: Date;
  message: string;
}
