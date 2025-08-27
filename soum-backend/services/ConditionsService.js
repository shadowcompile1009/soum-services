function ConditionsService(ConditionDAL) {

    async function GetConditionById(id) {
        return await ConditionDAL.GetConditionById(id);
    }

    async function AddNewCondition(id) {
        return await ConditionDAL.AddNewCondition(id);
    }

    async function UpdateCondition(id, data) {
        return await ConditionDAL.UpdateCondition(id, data);
    } 

    return {
        GetConditionById,
        AddNewCondition,
        UpdateCondition
    }
}

module.exports = ConditionsService