import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import {
  DmStatusGroup,
  GetAllDMStatusGroup,
  IDmStatusGroup,
} from '../models/DmStatusGroup';
import { lookup, unwind } from '../util/queryHelper';

@Service()
export class DmStatusGroupRepository {
  async add(obj: IDmStatusGroup) {
    try {
      const newDmStatusGroup = new DmStatusGroup(obj);
      const data = await newDmStatusGroup.save();

      return [false, { result: data, message: '' }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DM_STATUS_GROUP,
          message: exception.message,
        },
      ];
    }
  }

  async update(
    id: any,
    obj: IDmStatusGroup
  ): Promise<[boolean, { result: any; message: string }]> {
    const dmStatusGroup = await DmStatusGroup.findById(id);
    if (!dmStatusGroup) {
      return [
        true,
        {
          result: null,
          message: Constants.ERROR_MAP.DM_STATUS_GROUP_NOT_FOUND,
        },
      ];
    }

    dmStatusGroup.id = obj.id;
    dmStatusGroup.group = obj.group;
    await dmStatusGroup.save();

    return [
      false,
      {
        result: dmStatusGroup,
        message: Constants.ERROR_MAP.DM_STATUS_GROUP_UPDATED,
      },
    ];
  }

  async remove(id: any) {
    const dmStatusGroup = await DmStatusGroup.findById(id);
    if (!dmStatusGroup) {
      return [
        true,
        {
          result: null,
          message: Constants.ERROR_MAP.DM_STATUS_GROUP_NOT_FOUND,
        },
      ];
    }

    await dmStatusGroup.remove();

    return [
      false,
      {
        result: dmStatusGroup,
        message: Constants.ERROR_MAP.DM_STATUS_GROUP_UPDATED,
      },
    ];
  }

  async getAll(): Promise<GetAllDMStatusGroup[]> {
    return DmStatusGroup.aggregate([
      lookup('DeltaMachineStatuses', 'id', '_id', 'status'),
      unwind('$status', false),
      {
        $project: {
          _id: 0,
          id: 1,
          statusName: '$status.name',
          displayName: '$status.displayName',
          group: 1,
        },
      },
    ]);
  }
}
