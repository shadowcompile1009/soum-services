import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { GetAllDMStatusGroup, IDmStatusGroup } from '../models/DmStatusGroup';
import { DmStatusGroupRepository } from '../repositories/dmStatusGroupRepository';
import { DeltaMachineRepository } from '../repositories/deltaMachineRepository';
import { DeltaMachineStatusDocument } from '../models/DeltaMachineStatus';
import { DeltaMachineStatusName } from '../enums/DeltaMachineStatusName';
import { DMGroupName } from '../enums/DMGroupName';

@Service()
export class DmStatusGroupService {
  constructor(
    public dmStatusGroupRepository: DmStatusGroupRepository,
    public deltaMachineRepository: DeltaMachineRepository
  ) {}

  genDMStatusGroups = async (
    dmStatusGroups: any[]
  ): Promise<[boolean, { result: any; message?: string }]> => {
    try {
      const [error, dmStatuses] =
        await this.deltaMachineRepository.getStatusList();
      if (error) {
        return [
          error,
          {
            result: null,
            message: Constants.ERROR_MAP.FAILED_TO_GET_DM_STATUS_LIST,
          },
        ];
      }
      const refSetByName: any = (
        dmStatuses.result as DeltaMachineStatusDocument[]
      ).reduce((acc, cur) => ({ ...acc, [cur.name]: cur.id }), {});

      const refSetById: any = (
        dmStatuses.result as DeltaMachineStatusDocument[]
      ).reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});

      const existingGroupStatuses = await this.dmStatusGroupRepository.getAll();

      const existingGroupStatusesMap = new Map();
      existingGroupStatuses.forEach(item => {
        if (existingGroupStatusesMap.has(item.group)) {
          const group = existingGroupStatusesMap.get(item.group);
          group.push(refSetById[item.id]);
          existingGroupStatusesMap.set(item.group, group);
        } else {
          existingGroupStatusesMap.set(item.group, [refSetById[item.id]]);
        }
      });

      const newDmStatusGroups = dmStatusGroups.filter(
        item =>
          refSetByName[item['name']] &&
          (!existingGroupStatusesMap.has(item['group']) ||
            !existingGroupStatusesMap.get(item['group']).includes(item['name']))
      );

      const result = Promise.all(
        newDmStatusGroups.map(item => {
          return this.addDmStatusGroup({
            id: mongoose.Types.ObjectId(refSetByName[item['name']]),
            group: item.group,
          } as IDmStatusGroup);
        })
      );

      return [
        false,
        { result, message: 'Generate dmStatusGroup successfully' },
      ];
    } catch (exception) {}
  };

  async addDmStatusGroup(dmStatusGroup: IDmStatusGroup) {
    try {
      return this.dmStatusGroupRepository.add(dmStatusGroup);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_STATUS_GROUP,
          exception.message
        );
      }
    }
  }

  async getDmStatusGroups(
    groupName: string = ''
  ): Promise<GetAllDMStatusGroup[] | string[]> {
    const dmStatusGroups = await this.dmStatusGroupRepository.getAll();
    if (groupName) {
      groupName = groupName.toLowerCase();
      return dmStatusGroups.filter(item => {
        if (groupName === DMGroupName.DELIVERY) {
          return (
            item.group.toLowerCase() === groupName &&
            item.statusName.toLowerCase() !==
              DeltaMachineStatusName.DELIVERED_SOUM_PRODUCT
          );
        }
        if (groupName === DMGroupName.DISPUTE) {
          return (
            item.group.toLowerCase() === DMGroupName.DISPUTED.toLowerCase() &&
            item.statusName.toLowerCase() !==
              DeltaMachineStatusName.RETURN_LABEL_SENT &&
            item.statusName.toLowerCase() !==
              DeltaMachineStatusName.DISPUTE_CLOSED_AND_RETURNED_TO_SOUM
          );
        } else {
          return item.group.toLowerCase() === groupName;
        }
      });
    }
    return dmStatusGroups;
  }
}
