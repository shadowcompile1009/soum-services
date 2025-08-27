import { DeltaMachineStatusSubmodule } from '../../enums/DeltaMachineStatusSubmodule';

export class ListDmoDto {
  offset?: number;
  limit?: number;
  submodule?: DeltaMachineStatusSubmodule;
  searchOption?: any;
  statuses?: string[];
  services?: string[];
}
