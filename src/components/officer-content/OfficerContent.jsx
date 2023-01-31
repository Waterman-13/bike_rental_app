import css from './OfficerContent.module.css'
import close from './close.png'
import { SERVER, REQUESTS, IS_MOCK_DATA } from '../../const'
import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { editOfficer } from '../../.store/actionCreators/officers'
import Header from '../header/Header'
import InputText from '../../elements/input-text/InputText'
import PageNothingNever from '../page-nothing-never/PageNothingNever'

const axios = require('axios').default

const OfficerContent = () => {
    const params = useParams()
    const officers = useSelector(state => state.officersReducer.officers)
    const token = useSelector(state => state.appReducer.activeToken)
    const dispatch = useDispatch()
    const navigate=useNavigate()

    const officer = officers.find((item) => item._id === params.officerId)

    const [firstName, setFirstName] = useState(!officer ? '' : officer.firstName)
    const [lastName, setLastName] = useState(!officer ? '' : officer.lastName)
    const [password, setPassword] = useState('')
    const [approved, setApproved] = useState(!officer ? false : officer.approved)
    const [messages, setMessage] = useState([])
    const [isSaving, setIsSaving] = useState(false)

    const _editOfficer = (dataOfficer) => {
        dispatch(editOfficer(dataOfficer))

        navigate('/officers')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        
        let msgs = []
        if (password.length === 0) {
            msgs = [ ...msgs, 'Поле Пароль должно быть заполнено']
        } 
        if (msgs.length === 0) {

            const editOfficer = {
                email: officer.email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                clientId: officer.clientId,
                approved: approved
            }

            if (!IS_MOCK_DATA) {
                if (token) {
                    setIsSaving(true)
                    axios
                        .put(SERVER + REQUESTS.PUT_OFFICER.replace(':id', officer._id), 
                            editOfficer, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + token
                            }
                        })
                        .then(response => {
                            if(response.data) _editOfficer(response.data.data)
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
                editOfficer._id = officer._id
                _editOfficer(editOfficer)
            }
        }
        setMessage(msgs)
    }

    if (!officer) return <PageNothingNever />

    return (
        <>
            <Header />
            <div className={css.container}>
                <div className={css.title}>
                    <h1>Сотрудник</h1>
                    <Link to='/officers'>
                        <img src={close} alt='кнопка закрытия окна' title='Закрыть' className={css.close} />
                    </Link>
                </div>
                <form onSubmit={(e) => handleSubmit(e)} className={css.form}>
                    <div className={css.input}>
                        <p>clientId</p>
                        <div className={css.disabled}>{officer.clientId}</div>
                    </div>
                    <div className={css.input}>
                        <p>Email</p>
                        <div className={css.disabled}>{officer.email}</div>
                    </div>
                    <div className={css.input}>
                        <p>Пароль</p>
                        <InputText
                            placeholder={"Пароль"}
                            isPassword
                            inputValue={password}
                            validate={value => (value.length === 0)}
                            onChange={value => {
                                setPassword(value)
                                setMessage([])
                            }}
                            errorMessage={value => 'Введите пароль'}
                        />
                    </div>
                    <div className={css.input}>
                        <p>Имя сотрудника</p>
                        <InputText
                            placeholder={"Имя сотрудника"}
                            inputValue={firstName}
                            onChange={value => {
                                setFirstName(value)
                                setMessage([])
                            }}
                        />
                    </div>
                    <div className={css.input}>
                        <p>Фамилия сотрудника</p>
                        <InputText
                            placeholder={"Фамилия сотрудника"}
                            inputValue={lastName}
                            onChange={value => {
                                setLastName(value)
                                setMessage([])
                            }}
                        />
                    </div>
                    <div className={css.input + ' ' + css.checkbox}>
                        <p>Одобрен</p>
                        <input type='checkbox' checked={approved} onChange={(e) => {setApproved(e.target.checked)}} />
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

export default OfficerContent