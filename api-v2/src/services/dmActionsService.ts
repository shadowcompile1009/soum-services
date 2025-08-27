import { Service } from 'typedi';
import { DmActionsRepository } from '../repositories/dmActionsRepository';
import { DeltaMachineRepository } from '../repositories/deltaMachineRepository';
import { DeltaMachineStatusDocument } from '../models/DeltaMachineStatus';
import {
  CreateDmActionsDto,
  DmActions,
  DmActionsDto,
  DmActionsDocument,
} from '../models/DmActions';

@Service()
export class DmActionsService {
  constructor(
    public dmActionsRepository: DmActionsRepository,
    public deltaMachineRepository: DeltaMachineRepository
  ) {}

  genDMActions = async (
    actions: CreateDmActionsDto[]
  ): Promise<DmActionsDocument[]> => {
    const allActions = await DmActions.find();

    const existingActionsMap = new Map();
    allActions.forEach(item => {
      existingActionsMap.set(item.name, item);
    });

    const [, dmStatuses] = await this.deltaMachineRepository.getStatusList();

    const refSetByName: any = (
      dmStatuses.result as DeltaMachineStatusDocument[]
    ).reduce((acc, cur) => ({ ...acc, [cur.name]: cur.id }), {});

    const newActions: DmActionsDto[] = [];
    actions.forEach(item => {
      const statusId = refSetByName[item.statusName];
      const tempItem = item;
      tempItem.actions = tempItem.actions.filter(
        a =>
          (existingActionsMap.has(a) &&
            existingActionsMap.get(a)?.statusId !== statusId) ||
          !existingActionsMap.has(a)
      );
      tempItem.actions.forEach(action => {
        newActions.push({
          statusId,
          name: action,
        });
      });
    });
    return this.dmActionsRepository.createDmActions(newActions);
  };

  listAll = async (statusId: string = null): Promise<DmActionsDocument[]> => {
    return this.dmActionsRepository.getAll(statusId);
  };

  get = async (id: string): Promise<DmActionsDocument> => {
    return this.dmActionsRepository.get(id);
  };
}
