//infoSpecialized
const initialState = [{

}]

export default function Bill(state = initialState, action) {
    switch (action.type) {
        case 'GET_BILL_INFO':
            if (state[0].idPhong === undefined) {
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
        default:
            return state;
    }
}