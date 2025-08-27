const ConditionDAL = require('../../../Data/ConditionDAL');
const ConditionsService = require('../../../services/ConditionsService');
const Helper = require('../../../config/helper');
const Messages = require('../../../config/messages.js');

async function GetConditionById(req, res) {
    try {
      const id = req.params.id;
      let conditionsService = new ConditionsService(ConditionDAL);
      const condition = await conditionsService.GetConditionById(id);
      
      if (condition) {
        if (condition.length === 0) {
          return Helper.response(res, 200, "condition", { condition: [], isNullPriceRange: true });
        }

        condition[0].timeTillSoldFairPrice = {
          like_new:
            condition[0] &&
            condition[0].timeTillSold &&
            condition[0].timeTillSold.timeTillSoldLikeNewFair
              ? condition[0].timeTillSold.timeTillSoldLikeNewFair
              : 3,
          light_use:
            condition[0] &&
            condition[0].timeTillSold &&
            condition[0].timeTillSold.timeTillSoldLightlyUsedFair
              ? condition[0].timeTillSold.timeTillSoldLightlyUsedFair
              : 4,
          good_condition:
            condition[0] &&
            condition[0].timeTillSold &&
            condition[0].timeTillSold.timeTillSoldGoodConditionFair
              ? condition[0].timeTillSold.timeTillSoldGoodConditionFair
              : 5,
          extensive_use:
            condition[0] &&
            condition[0].timeTillSold &&
            condition[0].timeTillSold.timeTillSoldExtensivelyUsedFair
              ? condition[0].timeTillSold.timeTillSoldExtensivelyUsedFair
              : 6,
        };
        // get priceNudgeSettings
        const priceNudgeSetting = await Helper.get_price_nudge_settings(condition[0].varient_id);
        if (priceNudgeSetting) {
          condition[0].like_new = condition[0].priceRange.like_new_min_excellent_price_nudge || condition[0].like_new;
          condition[0].like_new_ar = condition[0].priceRange.like_new_min_excellent_price_nudge || condition[0].like_new_ar;
          condition[0].light_use = condition[0].priceRange.lightly_used_min_excellent_price_nudge || condition[0].light_use;
          condition[0].light_use_ar = condition[0].priceRange.lightly_used_min_excellent_price_nudge || condition[0].light_use_ar;
          condition[0].good_condition = condition[0].priceRange.good_condition_min_excellent_price_nudge || condition[0].good_condition;
          condition[0].good_condition_ar = condition[0].priceRange.good_condition_min_excellent_price_nudge || condition[0].good_condition_ar; 
          condition[0].extensive_use = condition[0].priceRange.extensively_used_min_excellent_price_nudge || condition[0].extensive_use;
          condition[0].extensive_use_ar = condition[0].priceRange.extensively_used_min_excellent_price_nudge || condition[0].extensive_use_ar;
          condition[0].priceRange = {
            ...condition[0].priceRange,
            like_new_min_expensive: condition[0].priceRange.like_new_min_expensive_price_nudge || condition[0].priceRange.like_new_min_expensive,
            like_new_min_fair: condition[0].priceRange.like_new_min_fair_price_nudge || condition[0].priceRange.like_new_min_fair,
            like_new_min_excellent: condition[0].priceRange.like_new_min_excellent_price_nudge || condition[0].priceRange.like_new_min_excellent,
            lightly_used_min_expensive: condition[0].priceRange.lightly_used_min_expensive_price_nudge || condition[0].priceRange.lightly_used_min_expensive,
            lightly_used_min_fair: condition[0].priceRange.lightly_used_min_fair_price_nudge || condition[0].priceRange.lightly_used_min_fair,
            lightly_used_min_excellent: condition[0].priceRange.lightly_used_min_excellent_price_nudge || condition[0].priceRange.lightly_used_min_excellent,
            good_condition_min_expensive: condition[0].priceRange.good_condition_min_expensive_price_nudge || condition[0].priceRange.good_condition_min_expensive,
            good_condition_min_fair: condition[0].priceRange.good_condition_min_fair_price_nudge || condition[0].priceRange.good_condition_min_fair,
            good_condition_min_excellent: condition[0].priceRange.good_condition_min_excellent_price_nudge || condition[0].priceRange.good_condition_min_excellent,
            extensively_used_min_expensive: condition[0].priceRange.extensively_used_min_expensive_price_nudge || condition[0].priceRange.extensively_used_min_expensive,
            extensively_used_min_fair: condition[0].priceRange.extensively_used_min_fair_price_nudge || condition[0].priceRange.extensively_used_min_fair,
            extensively_used_min_excellent: condition[0].priceRange.extensively_used_min_excellent_price_nudge || condition[0].priceRange.extensively_used_min_excellent,
          };
          condition[0].timeTillSold = {
            ...condition[0].timeTillSold,
            timeTillSoldLikeNewExpensive: condition[0].timeTillSold.timeTillSoldLikeNewExpensiveNudge || condition[0].timeTillSold.timeTillSoldLikeNewExpensive,
            timeTillSoldLikeNewFair: condition[0].timeTillSold.timeTillSoldLikeNewFairNudge || condition[0].timeTillSold.timeTillSoldLikeNewFair,
            timeTillSoldLikeNewExcellent: condition[0].timeTillSold.timeTillSoldLikeNewExcellentNudge || condition[0].timeTillSold.timeTillSoldLikeNewExcellent,
            timeTillSoldLightlyUsedExpensive: condition[0].timeTillSold.timeTillSoldLightlyUsedExpensiveNudge || condition[0].timeTillSold.timeTillSoldLightlyUsedExpensive,
            timeTillSoldLightlyUsedFair: condition[0].timeTillSold.timeTillSoldLightlyUsedFairNudge || condition[0].timeTillSold.timeTillSoldLightlyUsedFair,
            timeTillSoldLightlyUsedExcellent: condition[0].timeTillSold.timeTillSoldLightlyUsedExcellentNudge || condition[0].timeTillSold.timeTillSoldLightlyUsedExcellent,
            timeTillSoldGoodConditionExpensive: condition[0].timeTillSold.timeTillSoldGoodConditionExpensiveNudge || condition[0].timeTillSold.timeTillSoldGoodConditionExpensive,
            timeTillSoldGoodConditionFair: condition[0].timeTillSold.timeTillSoldGoodConditionFairNudge || condition[0].timeTillSold.timeTillSoldGoodConditionFair,
            timeTillSoldGoodConditionExcellent: condition[0].timeTillSold.timeTillSoldGoodConditionExcellentNudge || condition[0].timeTillSold.timeTillSoldGoodConditionExcellent,
            timeTillSoldExtensivelyUsedExpensive: condition[0].timeTillSold.timeTillSoldExtensivelyUsedExpensiveNudge || condition[0].timeTillSold.timeTillSoldExtensivelyUsedExpensive,
            timeTillSoldExtensivelyUsedFair: condition[0].timeTillSold.timeTillSoldExtensivelyUsedFairNudge || condition[0].timeTillSold.timeTillSoldExtensivelyUsedFair,
            timeTillSoldExtensivelyUsedExcellent: condition[0].timeTillSold.timeTillSoldExtensivelyUsedExcellentNudge || condition[0].timeTillSold.timeTillSoldExtensivelyUsedExcellent
          };
          condition[0].timeTillSoldFairPrice = {
            like_new: condition[0].timeTillSold.timeTillSoldLikeNewFairNudge || condition[0].timeTillSold.timeTillSoldLikeNewFair,
            light_use: condition[0].timeTillSold.timeTillSoldLightlyUsedFairNudge || condition[0].timeTillSold.timeTillSoldLightlyUsedFair,
            good_condition: condition[0].timeTillSold.timeTillSoldGoodConditionFairNudge || condition[0].timeTillSold.timeTillSoldGoodConditionFair,
            extensive_use: condition[0].timeTillSold.timeTillSoldExtensivelyUsedFairNudge || condition[0].timeTillSold.timeTillSoldExtensivelyUsedFair,
          };
        }
        return Helper.response(res, 200, "condition", {
          condition: condition,
          isNullPriceRange: Object.values(condition[0].priceRange).some(value => value === null ? true : false)
        });
      } else {
        return Helper.response(res, 200, "condition", { condition: [], isNullPriceRange: true });
      }
    } catch (error) {
      return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  }


module.exports = {
    GetConditionById
}