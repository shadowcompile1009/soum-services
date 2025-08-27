const CategoryModel = require('../../../models/CategoryModel.js');
const Helper = require('../../../config/helper.js');
const Messages = require('../../../config/messages.js');
const CategoryDAL = require('../../../Data/CategoryDAL')

async function AllCategoryList(req, res) {
	try {
		var { like } = req.query
		let allCategory = await CategoryDAL.GetAllActiveCategoryByName(like);
		// this is unneeded step
		allCategory.map(cate => {
			if (LOCALE == "ar") cate.category_name = cate.category_name_ar;
		});

		var result = { "categoryList": allCategory };
		Helper.response(res, 200, Messages.category.list[LOCALE], result);
	} catch (error) {
		console.log(error)
		Helper.response(res, 500, Messages.api.fail[LOCALE]);
	}
}

async function AddCategory(req, res) {
	try {
		await new Promise((resolve, reject) => {
			try {
				Helper.upload_space("category").single('category_icon');
				resolve();
			} catch (error) {
				reject(error)
			}
		})
		var { category_name } = req.body;
		const fileUrl = new URL(req.file.location);
		const cdnUrl =  ENV.AWS_CDN_ENDPOINT + fileUrl.pathname;
		let categoryFound = await CategoryDAL.GetCategoryByName(category_name)
		if (categoryFound) Helper.response(res, 400, Messages.category.exists[LOCALE]);
		var catObject = {
			category_name: category_name,
			category_icon: cdnUrl,
		};
		await CategoryDAL.CreateCategory(catObject);
		Helper.response(res, 200, Messages.category.added[LOCALE]);
	} catch (error) {
		Helper.response(res, 500, Messages.api.fail[LOCALE]);
	}
}

module.exports = {
	AllCategoryList,
	AddCategory
};
