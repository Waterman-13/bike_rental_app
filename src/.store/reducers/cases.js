import actions from '../actions/cases'

const initialState = {
    loadedCases: false,
    cases: [{
        _id: '',
        status: '',
        licenseNumber: '',
        type: '',
        ownerFullName: '',
        clientId: '',
        createdAt: new Date(''),
        updatedAt: new Date(''),
        color: '',
        date: new Date(''),
        officer: '',
        description: '',
        resolution: ''
    }]
}

function casesReducer (state = initialState, action) {
    switch (action.type) {
        case actions.SET_CASES:
            return {...state, cases: action.cases}
            break
        case actions.UNSET_CASES:
            return {...state, cases: initialState}
            break
        case actions.SET_LOADED_CASES:
                return {...state, loadedCases: action.loaded}
                break
        case actions.DELETE_CASE:
            return {...state,
				cases: state.cases.filter(item => item._id !== action.id)
			}
            break
        case actions.EDIT_CASE:
            return {...state,
                cases: state.cases.map(item => {
                    if (item._id === action.case._id) {
                        return action.case
                    } else {
                        return item
                    }
                })
            }
            break
        case actions.ADD_CASE:
            return {...state, cases: [...state.cases, action.case]}
            break
        default:
            return state
    }
} 

export default casesReducer
