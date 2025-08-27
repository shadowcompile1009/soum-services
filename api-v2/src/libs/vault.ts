import vault = require('node-vault');
import { getCache, setCache } from './redis';
// get new instance of the client
const vaultClient = vault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
});
const vaultConnection = async () => {
  try {
    const { roleId, secretId } = await getAccessViaAppRole('v2-app-role');
    const result = await vaultClient.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });
    vaultClient.token = result.auth.client_token;
  } catch (error) {
    console.log('Fail to access Vault ' + error);
  }
};
const readSecret = async (secretPath: string) => {
  try {
    let jwtAccessTokenPublicKey: string = await getCache(
      'JWT_ACCESS_TOKEN_PUBLIC_KEY'
    );
    if (!jwtAccessTokenPublicKey) {
      const secretData = await vaultClient.read(secretPath);
      jwtAccessTokenPublicKey =
        secretData?.data?.data?.JWT_ACCESS_TOKEN_PUBLIC_KEY ||
        process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY;
      await setCache('JWT_ACCESS_TOKEN_PUBLIC_KEY', jwtAccessTokenPublicKey);
    }
    return jwtAccessTokenPublicKey.replace(/\\n/g, '\n');
  } catch (error) {
    console.log('Fail to read secret key ' + error);
    return process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY;
  }
};

const getAccessViaAppRole = async (roleName: string) => {
  const roleRes = await vaultClient.getApproleRoleId({
    role_name: roleName,
  });
  const secretRes = await vaultClient.getApproleRoleSecret({
    role_name: roleName,
  });
  const roleId = roleRes?.data?.role_id;
  const secretId = secretRes?.data?.secret_id;
  return {
    roleId,
    secretId,
  };
};

const getSecretData = async (secretPath: string) => {
  try {
    const secretData = await vaultClient.read(secretPath);
    return secretData?.data?.data || {};
  } catch (error) {
    console.log('Fail to get secret key ' + error);
    return {};
  }
};

export { vaultConnection, readSecret, getSecretData };
