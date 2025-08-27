const CategoryModel = require('../models/CategoryModel');

async function GetAllActiveCategoryByName(nameMatch = "") {

    let aggregate = [
        { $match: { status: 'Active', category_name: { $regex: nameMatch, $options: 'i' } } },
        {
            $project: {
                _id: 0,
                category_id: "$_id",
                category_name: 1,
                category_name_ar: 1,
                category_icon: 1,
                mini_category_icon: 1,
                position: 1
            }
        },
        { $sort: { position: 1 } }
    ]
    return await CategoryModel.aggregate(aggregate);
}

async function GetCategoryByName(categoryName) {
    return await CategoryModel.findOne({ category_name: categoryName }, { lean: false });
}
module.exports = {
    GetAllActiveCategoryByName,
    GetCategoryByName
}