import css from './CaseContent.module.css'
import close from './close.png'
import { toDateTime, dateToInput, dateToJSON } from '../../utils'
import { SERVER, REQUESTS, STATUS_BIKE, TYPE_BIKE, IS_MOCK_DATA } from '../../const'
import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { editCase } from '../../.store/actionCreators/cases'
import Header from '../header/Header'
import InputText from '../../elements/input-text/InputText'
import PageNothingNever from '../page-nothing-never/PageNothingNever'
import SelectOfficersMock from '../../elements/select-officers-mock/SelectOfficersMock'
import SelectOfficers from '../../elements/select-officers/SelectOfficers'

const axios = require('axios').default

const CaseContent = () => {
    const params = useParams()
    const cases = useSelector(state => state.casesReducer.cases)
    const token = useSelector(state => state.appReducer.activeToken)
    const dispatch = useDispatch()
    const navigate=useNavigate()

    const theCase = cases.find((item) => item._id === params.caseId)

    const [status, setStatus] = useState(!theCase ? STATUS_BIKE.NEW : theCase.status === STATUS_BIKE.NEW ? STATUS_BIKE.IN_PROGRESS : theCase.status)
    const [licenseNumber, setLicenseNumber] = useState(!theCase ? '' : theCase.licenseNumber)
    const [type, setType] = useState(!theCase ? '' : theCase.type)
    const [ownerFullName, setOwnerFullName] = useState(!theCase ? '' : theCase.ownerFullName)
    const [color, setColor] = useState(!theCase ? '' : theCase.color)
    const [date, setDate] = useState(!theCase ? new Date() : new Date(theCase.date))
    const [officer, setOfficer] = useState(!theCase ? '' : theCase.officer)
    const [description, setDescription] = useState(!theCase ? '' : theCase.description ? theCase.description : '')
    const [resolution, setResolution] = useState(!theCase ? '' : theCase.resolution ? theCase.resolution : '')
    const [messages, setMessage] = useState([])
    const [isSaving, setIsSaving] = useState(false)

    const _editCase = (dataCase) => {
        dispatch(editCase(dataCase))

        navigate('/cases')
    }

    const handleChangeStatus = (index) => {
        switch (index) {
            case 0: 
                setStatus(STATUS_BIKE.NEW)
                break
            case 1: 
                setStatus(STATUS_BIKE.IN_PROGRESS)
                break
            case 2: 
                setStatus(STATUS_BIKE.DONE)
                break
            default:
        }
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
        if (status === STATUS_BIKE.DONE && resolution.length === 0) {
            msgs = [ ...msgs, 'Чтобы установить статус DONE, заполните поле "Завершающий комментарий']
        }
        if (new Date(date) > new Date()) {
            msgs = [ ...msgs, 'Дата кражи не может быть больше текущей']
        }
        if (msgs.length === 0) {

            const editCase = {
                status: resolution.length > 0 ? 'done' : status,
                licenseNumber: licenseNumber,
                ownerFullName: ownerFullName,
                type: type,
                color: color,
                date: dateToJSON(date),
                officer: officer,
                description: description,
                resolution: resolution
            }

            if (!IS_MOCK_DATA) {
                if (token) {
                    setIsSaving(true)
                    axios
                        .put(SERVER + REQUESTS.PUT_CASE.replace(':id', theCase._id), 
                            editCase, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + token
                            }
                        })
                        .then(response => {
                            if(response.data) _editCase(response.data.data)
                        })  
                        .catch(error => {
                            if (error.response) {
                                let errMessage = ''
                                switch (error.response.status) {
                                    default: errMessage = `Ошибка: ${error.response.status} - ${error.response.statusText}`
                                }
                                msgs = [ ...msgs, errMessage]
                                setMessage(msgs)
                                console.error(error.response)
                            } else {
                                console.error(error)
                            }
                        })
                }
            } else {
                editCase._id = theCase._id
                _editCase(editCase)
            }
        }
        setMessage(msgs)
    }

    if (!theCase) return <PageNothingNever />

    return (
        <>
            <Header />
            <div className={css.container}>
                <div className={css.title}>
                    <h1>Сообщение о краже</h1>
                    <Link to='/cases'>
                        <img src={close} alt='кнопка закрытия окна' title='Закрыть' className={css.close} />
                    </Link>
                </div>
                <div className={css.serviceInf}>
                    <div>ClientId: {theCase.clientId}</div>
                    <div>CreatedAt: {toDateTime(theCase.createdAt)}</div>
                    <div>UpdateAt: {toDateTime(theCase.updatedAt)}</div>
                </div>
                <form onSubmit={(e) => handleSubmit(e)} className={css.form}>
                    <div className={(css.input + ' ' + css.select)} >
                        <p>Статус сообщения</p>
                        <select className={css.status} 
                                value={status}
                                onChange={(e) => handleChangeStatus(e.target.selectedIndex)}>
                            <option key='1'>{STATUS_BIKE.NEW}</option>
                            <option key='2'>{STATUS_BIKE.IN_PROGRESS}</option>
                            <option key='3'>{STATUS_BIKE.DONE}</option>
                        </select>
                    </div>
                    <div className={css.input}>
                        <p>Номер лицензии</p>
                        <InputText
                            placeholder={"Номер лицензии"}
                            inputValue={licenseNumber}
                            autofocus={true}
                            validate={value => (value.length === 0)}
                            onChange={value => { 
                                setLicenseNumber(value)
                                setMessage([])
                            }}
                            errorMessage={value => 'Введите номер лицензии'}
                        />
                    </div>
                    <div className={(css.input + ' ' + css.select)}>
                        <p>Тип велосипеда</p>
                        <select className={css.type} 
                                value={type}
                                onChange={(e) => setType(TYPE_BIKE[e.target.selectedIndex])}>
                            {TYPE_BIKE.map((type, index) => {
                                return <option key={index}>{type}</option>
                            })}
                        </select>
                    </div>
                    <div className={css.input}>
                        <p>ФИО клиента</p>
                        <InputText
                            placeholder={"ФИО клиента"}
                            inputValue={ownerFullName}
                            validate={value => (value.length === 0)}
                            onChange={value => {
                                setOwnerFullName(value)
                                setMessage([])
                            }}
                            errorMessage={value => 'Введите ФИО клиента'}
                        />
                    </div>
                    <div className={css.input}>
                        <p>Цвет велосипеда</p>
                        <InputText
                            placeholder={"Цвет велосипеда"}
                            inputValue={color}
                            onChange={value => {
                                setColor(value)
                                setMessage([])
                            }}
                        />
                    </div>
                    <div className={css.input}>
                        <p>Дата кражи</p>
                        <InputText
                            inputValue={dateToInput(date)}
                            isDate={true}
                            placeholder={"Дата кражи"}
                            onChange={value => {
                                setDate(value)
                                setMessage([])
                            }}
                        />
                    </div>
                    <div className={css.input + ' ' + css.select}>
                        <p>Ответственный сотрудник</p>
                        { !IS_MOCK_DATA && <SelectOfficers inputValue={officer} onChangeOfficer={onChangeOfficer} />}
                        { IS_MOCK_DATA && <SelectOfficersMock inputValue={officer} onChangeOfficer={onChangeOfficer} />}
                    </div>
                    <div className={css.input}>
                        <p>Дополнительная информация</p>
                        <textarea className={css.description} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className={css.input}>
                        <p>Завершающий комментарий</p>
                        <textarea className={css.description} value={resolution} onChange={(e) => setResolution(e.target.value)} />
                    </div>
                    <div>
                        {isSaving && <div className={css.isSaving}>Сохранение изменений...</div>}
                        {!isSaving && <button className={css.btnSend}>Сохранить изменения</button>}
                        { messages.map((message, index) => (
                            <div className={css.message} key={index}>{message}</div>
                        ))}
                    </div>
                </form>
            </div>
        </>
    )
}

export default CaseContent