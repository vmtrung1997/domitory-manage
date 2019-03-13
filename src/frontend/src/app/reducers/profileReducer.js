//infoUser
const initialState = {

}

export default function UserProfile(state = initialState, action) {
    switch (action.type) {
        case 'GET_USER_INFO':
            return (
                {
                    ...action.payload
                }); 
        default:
            return state;
    }
}