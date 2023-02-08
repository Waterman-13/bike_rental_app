import actions from '../actions/officers'

const initialState = {
    loadedOfficers: false,
    officers: [{
        _id: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        clientId: '',
        approved: false
    }]
}

function officersReducer (state = initialState, action) {
    switch (action.type) {
        case actions.SET_OFFICERS:
            return {...state, officers: action.officers }
            break
        case actions.UNSET_OFFICERS:
            return {...state, officers: initialState}
            break
        case actions.SET_LOADED_OFFICERS:
                return {...state, loadedOfficers: action.loaded}
                break
        case actions.DELETE_OFFICER:
            return {...state,
			    officers: state.officers.filter(item => item._id !== action.id)
			}
            break
        case actions.EDIT_OFFICER:
            return {...state,
                officers: state.officers.map(item => {
                    if (item._id === action.officer._id) {
                        return action.officer
                    } else {
                        return item
                    }
                })
            }
            break
        case actions.ADD_OFFICER:
            return {...state, officers: [...state.officers, action.officer]}
            break
        default:
            return state
    }
} 

export default officersReducer
