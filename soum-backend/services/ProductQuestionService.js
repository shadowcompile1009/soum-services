function ProductQuestionService(ProductQuestionDAL) {

    async function listComments(page, limit) {
        return await ProductQuestionDAL.listComments(page, limit);
    }

    return {
        listComments,
    }
}

module.exports = ProductQuestionService