const initialState = [{}];

export default function Activity(state = initialState, action) {
    switch (action.type) {
        case 'GET_LIST_ACTIVITY':
            if (state[0]._id === undefined) {
                return [{
                    ...action.payload
                }];
            }
            else {
                return [
                    ...state,
                    {
                        ...action.payload
                    }];
            }
        case 'REGISTER_ACTIVITY':
            return state.filter(activity => activity._id !== action.payload)

        default:
            return state;
    }
}