//infoSpecialized
const initialState = [{

}]

export default function Specialized(state = initialState, action) {
    switch (action.type) {
        case 'GET_SPECIALIZED_INFO':
            return [
                ...state,
                {
                    ...action.payload
                }];
        default:
            return state;
    }
}