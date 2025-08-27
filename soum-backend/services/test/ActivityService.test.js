const ActivityService = require('../ActivityService');

let repo = {

}

describe('createActivity', () => {
    const service = new ActivityService(repo);

    test('Should throw error when null activity object is passed', async () => {
        try {
            const res = await service.createActivity(null);
            expect(true).toBe(false);
        } catch (error) {
            expect(error.message).toBe("ActivityError-1");
        }
    });

    test('Should throw error when invalid activity data is passed', async () => {
        try {
            const res = await service.createActivity({ userId: null, productId: '605742f7323860a2226cda81', activityType: 'type' });
            expect(true).toBe(false);
        } catch (error) {
            expect(error.message).toBe("ActivityError-1");
        }
    });

    test('Should throw error when invalid activity data is passed', async () => {
        try {
            const res = await service.createActivity({ userId: '605742f7323860a2226cda81', productId: null, activityType: 'type' });
            expect(true).toBe(false);
        } catch (error) {
            expect(error.message).toBe("ActivityError-1");
        }
    });

    test('Should throw error when invalid activity data is passed', async () => {
        try {
            const res = await service.createActivity({ userId: '605742f7323860a2226cda81', productId: '605742f7323860a2226cda81', activityType: null });
            expect(true).toBe(false);
        } catch (error) {
            expect(error.message).toBe("ActivityError-1");
        }
    });
});