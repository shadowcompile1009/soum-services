// Original file: node_modules/soum-proto/proto/authz.proto

export interface Permission {
  id?: string;
  name?: string;
  displayName?: string;
  key?: string;
  serviceName?: string;
}

export interface Permission__Output {
  id: string;
  name: string;
  displayName: string;
  key: string;
  serviceName: string;
}
