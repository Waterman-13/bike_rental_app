import css from './SelectOfficers.module.css'
import { SERVER, REQUESTS } from '../../const'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const axios = require('axios').default

const SelectOfficers = (props) => {
    const { inputValue, onChangeOfficer } = props

    const token = useSelector(state => state.appReducer.activeToken)
    const [value, setValue] = useState('')
    const [selectOfficers, setSelectOfficers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadData, setLoadData] = useState(true)
    const [errorMsg, setErrorMsg]  = useState('')

    const initData = (data) => {
        let val = ''

        const filterData = data.filter((item) => item.approved === true)
        setSelectOfficers(filterData)

        if (inputValue) {
            const off = filterData.filter((item) => inputValue === item._id)
            val = off ? off[0].lastName + ' ' + off[0].firstName : ''
        }
        setValue(val)
    }

    const onChange = (e) => {
        const name = e.target.value
        setValue(name)

        const choiceOfficer = selectOfficers.filter((item) => name === item.lastName + ' ' + item.firstName)
        onChangeOfficer(choiceOfficer[0] ? choiceOfficer[0]._id : '')
    }

    if (token && loadData) {
        axios
            .get(SERVER + REQUESTS.GET_OFFICERS, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                }
            })
            .then(response => {
                if(response.data) {
                    initData(response.data.officers)
                    setIsLoading(false)
                }
            })
            .catch(error => {
                if (error.response) {
                    let errMessage = ''
                    switch (error.response.status) {
                        default: errMessage = `Ошибка: ${error.response.status} - ${error.response.statusText}`
                    }
                    setErrorMsg(errMessage)
                } else {
                    console.error(error.message)
                }
            })
            .finally ( setLoadData(false) )
    }

    return (
        <>
            { errorMsg && <div className={css.isLoading}>{errorMsg}</div>}
            { isLoading && <div className={css.isLoading}>Загрузка...</div>}
            { !isLoading && <select className={css.select} value={value} onChange={(e) => (onChange(e))}>
                <option></option>
                {selectOfficers.map((item) => {
                    return <option key={item._id}>{item.lastName + ' ' + item.firstName}</option>
                })}
            </select>}
        </>
    )
}

export default SelectOfficers
