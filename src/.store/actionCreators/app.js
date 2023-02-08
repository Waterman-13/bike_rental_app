import actions from "../actions/app"

export const setUser = (value) => {
	return {
		type: actions.SET_USER,
		user: value
	}
}

export const unsetUser = () => {
	return {
		type: actions.UNSET_USER,
	}
}

export const setToken = (value) => {
	return {
		type: actions.SET_TOKEN,
		token: value
	}
}

export const unsetToken = () => {
	return {
		type: actions.UNSET_TOKEN,
	}
}
