import { Response } from 'express';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { RolePermission } from '../models/DeltaMachineUsers';

export default function permit(
  apiRouteKey: string,
  canAccessAll: boolean = false
) {
  // return a middleware
  const error = new ErrorResponseDto(
    Constants.ERROR_CODE.FORBIDDEN,
    Constants.ERROR_TYPE.API,
    Constants.ERROR_MAP.UNAUTHORIZED,
    Constants.ERROR_MAP.UNAUTHORIZED_USER
  );
  return (req: any, res: Response, next: any) => {
    const { userInfo } = req;
    if (canAccessAll && !userInfo.role?.canAccessAll) {
      return res.sendError(error);
    }
    if (
      userInfo.role?.canAccessAll ||
      (userInfo &&
        userInfo.role?.permissions.find(
          (permission: RolePermission) => permission.key === apiRouteKey
        ))
    ) {
      next(); // role is allowed, so continue on the next middleware
    } else {
      return res.sendError(error);
    }
  };
}
