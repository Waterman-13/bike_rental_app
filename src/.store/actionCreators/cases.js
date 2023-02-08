import actions from "../actions/cases"

export const setCases = (value) => {
	return {
		type: actions.SET_CASES,
		cases: value
	}
}

export const unsetCases = () => {
	return {
		type: actions.UNSET_CASES,
	}
}

export const setLoadedCases = (value) => {
	return {
		type: actions.SET_LOADED_CASES,
		loaded: value
	}
}

export const deleteCase = (value) => {
	return {
		type: actions.DELETE_CASE,
		id: value
	}
}

export const editCase = (value) => {
	return {
		type: actions.EDIT_CASE,
		case: value
	}
}

export const addCase = (value) => {
	return {
		type: actions.ADD_CASE,
		case: value,
	}
}
