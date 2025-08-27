import express from 'express';
import fs from 'fs';
import path from 'path';
import requireDir from 'require-directory';
import { Constants } from '../../constants/constant';
import IController from '../../controllers/v1/IController';
const apiControllerPath = '../../controllers';

export const routes = (app: any) => {
  const prefix = Constants.ROUTE_PREFIX;
  const enabledControllers = (process.env['ENABLED_CONTROLLERS'] || '').split(
    ','
  );
  // Configure API controller paths
  fs.readdirSync(path.resolve(__dirname, apiControllerPath)).forEach(dir => {
    const fullPath = path.join(apiControllerPath, dir);
    const importedFiles = requireDir(module, fullPath, {
      extensions: ['js', 'ts'],
    });
    const flatMappingList = Object.assign({}, ...Object.values(importedFiles));
    Object.keys(flatMappingList).forEach((key: string) => {
      if (
        enabledControllers.findIndex((item: string) => item === key) !== -1 ||
        enabledControllers[0] === ''
      ) {
        const router = express.Router();
        const dynamicController = flatMappingList[key];
        // If not interface
        if (dynamicController) {
          const controller: IController = new dynamicController(router);
          controller.initializeRoutes();
          app.use(prefix + dir + '/' + controller.path, router);
        }
      }
    });
  });
};
