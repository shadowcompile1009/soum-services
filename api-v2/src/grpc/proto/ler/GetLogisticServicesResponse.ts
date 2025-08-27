// Original file: node_modules/soum-proto/proto/ler.proto

export interface _ler_GetLogisticServicesResponse_LogisticService {
  serviceId?: string;
  serviceName?: string;
}

export interface _ler_GetLogisticServicesResponse_LogisticService__Output {
  serviceId: string;
  serviceName: string;
}

export interface _ler_GetLogisticServicesResponse_LogisticVendor {
  vendorId?: string;
  vendorName?: string;
  services?: string;
}

export interface _ler_GetLogisticServicesResponse_LogisticVendor__Output {
  vendorId: string;
  vendorName: string;
  services: string;
}

export interface GetLogisticServicesResponse {
  services?: _ler_GetLogisticServicesResponse_LogisticService[];
  vendors?: _ler_GetLogisticServicesResponse_LogisticVendor[];
}

export interface GetLogisticServicesResponse__Output {
  services: _ler_GetLogisticServicesResponse_LogisticService__Output[];
  vendors: _ler_GetLogisticServicesResponse_LogisticVendor__Output[];
}
