export const toDateTime = (stringDate) => {
    if (stringDate) {
        const date = new Date(stringDate)
        return date.toLocaleString('ru-RU')
    }
    return ''
}

export const dateToInput = (date) => {
    if (typeof(date) === 'string') {
        if (date) {
            const d = new Date(date)
            return d.toLocaleDateString('ru-RU')
        }
        return ''
    }
    if (typeof(date) === 'object') {
        if (date) return date.toISOString().slice(0, 10)
        else return ''
    }
}

export const dateToJSON = (date) => {
    if (typeof(date) === 'string') {
        const d = new Date(date)
        return d.toISOString()
    }
    if (typeof(date) === 'object') {
        if (date) return date.toISOString()
        else return ''
    }
}
