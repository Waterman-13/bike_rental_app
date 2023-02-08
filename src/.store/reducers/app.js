import actions from '../actions/app'

const initialState = {
    activeUser: '',
    activeToken: ''
}

function appReducer (state = initialState, action) {
    switch (action.type) {
        case actions.SET_USER:
            return {...state, activeUser: action.user}
            break
        case actions.UNSET_USER:
            return {...state, activeUser: ''}
            break
        case actions.SET_TOKEN:
            return {...state, activeToken: action.token}
            break
        case actions.UNSET_TOKEN:
            return {...state, activeToken: ''}
            break
        default:
            return state
    }
} 

export default appReducer
