import css from './FormNewCase.module.css'
import close from './close.png'
import { SERVER, REQUESTS, CLIENT_ID, TYPE_BIKE, IS_MOCK_DATA } from '../../const'
import { dateToInput, dateToJSON } from '../../utils'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addCase } from '../../.store/actionCreators/cases'
import Header from '../header/Header'
import InputText from '../../elements/input-text/InputText'
import SelectOfficersMock from '../../elements/select-officers-mock/SelectOfficersMock'
import SelectOfficers from '../../elements/select-officers/SelectOfficers'

const axios = require('axios').default

const FormNewCase = () => {
    const user = useSelector(state => state.appReducer.activeUser)
    const token = useSelector(state => state.appReducer.activeToken)
    const loaded = useSelector(state => state.casesReducer.loadedCases)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [licenseNumber, setLicenseNumber] = useState('')
    const [ownerFullName, setOwnerFullName] = useState('')
    const [type, setType] = useState(TYPE_BIKE[0])
    const [color, setColor] = useState('')
    const [date, setDate] = useState(new Date())
    const [officer, setOfficer] = useState('');
    const [description, setDescription] = useState('')
    const [messages, setMessage] = useState([])
    const [isSending, setIsSending] = useState(false)
    const [update, setUpdate] = useState(true)

    const initCase = () => {
        setLicenseNumber('')
        setOwnerFullName('')
        setType(TYPE_BIKE[0])
        setColor('')
        setDate(new Date())
        setOfficer('')
        setDescription('')

        setUpdate(true)
    }
    
    const _addCase = (data) => {
        dispatch(addCase(data))
    }

    const onChangeOfficer = (id) => {
        setOfficer(id)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        let msgs = []
        if (licenseNumber.length === 0) {
            msgs = [ ...msgs, 'Поле "Номер лицензии" должно быть заполнено']
        }
        if (ownerFullName.length === 0) {
            msgs = [ ...msgs, 'Поле "ФИО клиента" должно быть заполнено']
        }
        if (new Date(date) > new Date()) {
            msgs = [ ...msgs, 'Дата кражи не может быть больше текущей']
        }
        if (msgs.length === 0) {
            if (!IS_MOCK_DATA) {
                setIsSending(true)
                setUpdate(false)
                let url = ''
                let data = {}
                let headers = {}

                if (token) {
                    url = SERVER + REQUESTS.POST_CASE
                    data = {
                        licenseNumber: licenseNumber,
                        ownerFullName: ownerFullName,
                        type: type,
                        color: color,
                        date: dateToJSON(date),
                        officer: officer,
                        description: description
                    }
                    headers = {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token
                    }
                } else {
                    url = SERVER + REQUESTS.POST_CASE_PUBLIC
                    data = {
                        licenseNumber: licenseNumber,
                        ownerFullName: ownerFullName,
                        type: type,
                        clientId: CLIENT_ID,
                        color: color,
                        date: dateToJSON(date),
                        description: description
                    }
                    headers = {
                        'Content-Type': 'application/json',
                    }
                }

                axios
                    .post(url, data, { headers })
                    .then(response => {
                        if (response.data && loaded) _addCase(response.data.data)
                        if (!user) navigate('/')
                        setIsSending(false)
                        initCase()
                    })
                    .catch(error => {
                        if (error.response) {
                            let errMessage = ''
                            switch (error.response.status) {
                                default: errMessage = `Ошибка: ${error.response.status} - ${error.response.statusText}`
                            }
                            msgs = [ ...msgs, errMessage]
                        } else {
                            msgs = [ ...msgs, error.message]
                        }
                        setMessage(msgs)
                    })
            } else {
                navigate('/')
            }
        }
        setMessage(msgs)
    }

    return (
        <>
            <Header />
            <div className={css.container}>
                <div className={css.title}>
                    <h1>Сообщить о краже</h1>
                    <Link to='/'>
                        <img src={close} alt='кнопка закрытия окна' title='Закрыть' className={css.close} />
                    </Link>
                </div>
                <form onSubmit={(e) => handleSubmit(e)} className={css.form}>
                    <div className={css.input}>
                        <p>Номер лицензии</p>
                        { update && <InputText
                                        autofocus={true}
                                        placeholder={"Номер лицензии"}
                                        inputValue={licenseNumber}
                                        validate={value => (value.length === 0)}
                                        onChange={value => { 
                                            setLicenseNumber(value)
                                            setMessage([])
                                        }}
                                        errorMessage={value => 'Введите номер лицензии'}
                        />}
                    </div>
                    <div className={css.input}>
                        <p>ФИО клиента</p>
                        { update && <InputText
                                        placeholder={"ФИО клиента"}
                                        validate={value => (value.length === 0)}
                                        onChange={value => {
                                            setOwnerFullName(value)
                                            setMessage([])
                                        }}
                                        errorMessage={value => 'Введите ФИО клиента'}
                        />}
                    </div>
                    <div className={(css.input + ' ' + css.select)}>
                        <p>Тип велосипеда</p>
                        <select className={css.type} value={type} onChange={(e) => setType(TYPE_BIKE[e.target.selectedIndex])}>
                            {TYPE_BIKE.map((type, index) => {
                                return <option key={index}>{type}</option>
                            })}
                        </select>
                    </div>
                    <div className={css.input}>
                        <p>Цвет велосипеда</p>
                        { update && <InputText
                                        placeholder={"Цвет велосипеда"}
                                        onChange={value => {
                                            setColor(value)
                                            setMessage([])
                                        }}
                        />}
                    </div>
                    <div className={css.input}>
                    <p>Дата кражи</p>
                    { update && <InputText
                                        isDate={true}
                                        placeholder={"Дата кражи"}
                                        inputValue={dateToInput(date)}
                                        onChange={value => {
                                            setDate(value)
                                            setMessage([])
                                        }}
                    />}
                    </div>
                    { update && user && 
                        <div className={(css.input + ' ' + css.select)}>
                            <p>Ответственный сотрудник</p>
                            {!IS_MOCK_DATA &&<SelectOfficers onChangeOfficer={onChangeOfficer} />}
                            { IS_MOCK_DATA &&<SelectOfficersMock onChangeOfficer={onChangeOfficer} />}
                        </div>
                    }
                    <div className={css.input}>
                        <p>Дополнительная информация</p>
                        <textarea className={css.description} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div>
                        {isSending && <div className={css.isSending}>Сообщение отправляется...</div>}
                        {!isSending && <button className={css.btnSend}>Отправить сообщение</button>}
                        { messages.map((message, index) => (
                            <div className={css.message} key={index}>{message}</div>
                        ))}
                    </div>
                </form>
            </div>
        </>
    )
}

export default FormNewCase
