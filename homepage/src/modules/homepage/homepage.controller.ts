import { Controller, Inject, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HomepageService } from './homepage.service';
import { createKey, getCache, setCache } from '@src/utils/redis';

@Controller('/')
@ApiTags('Homepage')
export class HomepageController {
  @Inject(HomepageService)
  private readonly homepageService: HomepageService;

  @Get('/data')
  async getHomepageData() {
    const key = createKey('home', []);
    let homeData = await getCache<any>(key);
    if (homeData == null || homeData == undefined) {
      homeData = await this.homepageService.getHomepageData();
      await setCache(key, homeData, 60);
    }
    return homeData;
  }

  @Get('/data/:category')
  async getHomepageDataByCategory(@Req() request: any) {
    const key = createKey(`home-${request?.params?.category}`, []);
    let homeData = await getCache<any>(key);
    if (homeData == null || homeData == undefined) {
      homeData = await this.homepageService.getHomepageDataByCategory(request?.params?.category);
      await setCache(key, homeData, 60);
    }
    return homeData;
  }

  @Get('/status')
  async getStatus() {
    return { statu: 'OK' };
  }
}
