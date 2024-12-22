import * as httpRequest from '~/utils/httpRequest';

export const getFollowings = async ({page = 1}) => {
    try {
        const data = await httpRequest.get('/me/followings', {
            params: {
                page,
            },        
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC90aWt0b2suZnVsbHN0YWNrLmVkdS52blwvYXBpXC9hdXRoXC9sb2dpbiIsImlhdCI6MTcyOTY4MDk5MSwiZXhwIjoxNzMyMjcyOTkxLCJuYmYiOjE3Mjk2ODA5OTEsImp0aSI6IlUyRnVycWZGZWczMlM2WFUiLCJzdWIiOjY3NTcsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.iXYpv8F-HklhxDPjmPcG3fb3I-R7DaJc2_91BYKitN8'
            }
        });
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const follow = async (userId) => {
    try {
        const res = await httpRequest.post(`/users/${userId}/follow`, userId);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export const unfollow = async (userId) => {
    try {
        const res = await httpRequest.post(`/users/${userId}/unfollow`, userId);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
