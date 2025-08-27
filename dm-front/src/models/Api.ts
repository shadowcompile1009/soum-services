const basePath = 'dm-backend';

const getEndPoint = (path: string) => `${basePath}/${path}`;

export const ApiEndpoints = {
  penaltySettings: () => getEndPoint('penalty-settings'),
};
