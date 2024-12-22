import * as httpRequest from '~/utils/httpRequest'; //gom tat ca export const vao obj request

const seachOptions = { type: 'less', page: undefined };
export const search = async (queryString, options = seachOptions) => {
    try {
        const res = await httpRequest.get('/users/search', {
            params: {
                q: queryString,
                ...options,
            },
        });

        if (options.type === 'more') {
            const {
                data: searchResult,
                meta: { pagination },
            } = res;
            return { searchResult, pagination };
        }
        const { data: searchResult } = res;
        return { searchResult };
    } catch (error) {
        console.log(error);
    }
};

//sucess: {}
//error: undefined
