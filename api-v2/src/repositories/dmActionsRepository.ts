import { Service } from 'typedi';
import {
  DmActions,
  DmActionsDocument,
  DmActionsDto,
} from '../models/DmActions';

@Service()
export class DmActionsRepository {
  async createDmActions(actions: DmActionsDto[]): Promise<DmActionsDocument[]> {
    return DmActions.insertMany(actions);
  }

  async getAll(statusId: string = null): Promise<DmActionsDocument[]> {
    const matchCondition = statusId ? { statusId } : {};
    return DmActions.find(matchCondition);
  }

  async get(id: string): Promise<DmActionsDocument> {
    return DmActions.findOne({ _id: id });
  }
}
