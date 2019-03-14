//infoSpecialized
const initialState = [{

}]

export default function School(state = initialState, action) {
    switch (action.type) {
        case 'GET_SCHOOL_INFO':
            return [
                ...state,
                {
                    ...action.payload
                }];
        default:
            return state;
    }
}