// Original file: node_modules/soum-proto/proto/ler.proto

export interface User {
  name?: string;
  mobileNumber?: string;
  address?: string;
  email?: string;
  userType?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  _latitude?: 'latitude';
  _longitude?: 'longitude';
}

export interface User__Output {
  name: string;
  mobileNumber: string;
  address: string;
  email: string;
  userType: string;
  city: string;
  latitude?: string;
  longitude?: string;
  _latitude: 'latitude';
  _longitude: 'longitude';
}
