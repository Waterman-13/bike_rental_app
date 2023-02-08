import actions from "../actions/officers"

export const setOfficers = (value) => {
	return {
		type: actions.SET_OFFICERS,
		officers: value
	}
}

export const unsetOfficers = () => {
	return {
		type: actions.UNSET_OFFICERS,
	}
}

export const setLoadedOfficers = (value) => {
	return {
		type: actions.SET_LOADED_OFFICERS,
		loaded: value
	}
}

export const deleteOfficer = (value) => {
	return {
		type: actions.DELETE_OFFICER,
		id: value
	}
}

export const editOfficer = (value) => {
	return {
		type: actions.EDIT_OFFICER,
		officer: value
	}
}

export const addOfficer = (value) => {
	return {
		type: actions.ADD_OFFICER,
		officer: value,
	}
}
