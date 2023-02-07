import css from './FormLogin.module.css'
import close from './close.png'
import { SERVER, REQUESTS, IS_MOCK_DATA } from '../../const'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser, setToken } from '../../.store/actionCreators/app'
import InputText from '../../elements/input-text/InputText'

const axios = require('axios').default

const VALID_EMAIL = 'admin@ggg.ru';
const VALID_PASSWORD = 'admin';

const FormLogin = () => {
    const reg = new RegExp(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    const assignUser = (data) => {
        let user = ''
        if (data.user.firstName || data.user.lastName) user = data.user.firstName + ' ' + data.user.lastName
        if (user === '') user = data.user.email
        if (user.length > 0) dispatch(setUser(user))

        if (data.token && !IS_MOCK_DATA) {
            localStorage.setItem('token', JSON.stringify(data.token))
            dispatch(setToken(data.token))
        }
        navigate('/')
    }

    const checkToken = () => {
        const token = JSON.parse(localStorage.getItem("token"))
        if (token) {
            axios
                .get(SERVER +  REQUESTS.GET_TOKEN, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token
                    }
                })
                .then(response => {
                    if (response.data) {
                        setEmail(response.data.data.user.email)
                        setIsLoading (false)
                    }
                })
                .catch(error => { console.error(error) })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (reg.test(email) === false) {
            setMessage('Адрес электронной почты неверный')
        } else if (password.length === 0) {
            setMessage('Пароль не может быть пустым')
        } else {
            if (!IS_MOCK_DATA) {
                axios
                    .post(SERVER + REQUESTS.POST_SIGN_IN, {
                            email: email,
                            password: password
                        }, {
                        headers: {
                        'Content-Type': 'application/json'
                        },
                    })
                    .then(response => {
                        if (response.data) {
                            assignUser(response.data.data)
                            navigate('/')
                        }
                    })
                    .catch(error => {
                        if (error.response) {
                            let errMessage = ''
                            switch (error.response.status) {
                                case 400: errMessage = 'Такая учетная запись не зарегестрирована'
                                    break
                                default: errMessage = `Ошибка ${error.response.status} - ${error.response.statusText} на сервере`
                            }
                            setMessage(errMessage)
                        } else {
                            console.error(error.message)
                        }
                    })
            } else {
                if (email === VALID_EMAIL && password === VALID_PASSWORD) {
                    dispatch(setUser('Вадим Семагин'))
                } else {
                    setMessage('Неверный email или пароль')
                }
            }
        }
    }

    useEffect(() => {
        if (IS_MOCK_DATA) {
            setIsLoading(false)
            setEmail("admin@ggg.ru")
            setPassword("admin")
        } else {
            if (isLoading) {
                checkToken()
            }
        }
    }, [isLoading])

    return (
        <div className={css.wrapper}>
            <div className={css.container}>
                <div className={css.title}>
                    <h1>Вход</h1>
                    <Link to='/'>
                        <img src={close} alt='конпка закрытия окна' title='Закрыть' className={css.close} />
                    </Link>
                </div>
                <form onSubmit={(e) => handleSubmit(e)} className={css.form}>
                    {isLoading && <div>Загрузка...</div>}
                    {!isLoading && <InputText
                                        autofocus={true}
                                        placeholder={"Электронная почта"}
                                        inputValue={email}
                                        validate={value => (reg.test(value) === false)}
                                        onChange={value => { 
                                            setEmail(value)
                                            setMessage('')
                                        }}
                                        errorMessage={value => 'Введите корректный адрес электронной почты'}
                    />}
                    {isLoading && <div>Загрузка...</div>}
                    {!isLoading && <InputText
                                        placeholder={"Пароль"}
                                        isPassword
                                        inputValue={password}
                                        validate={value => (value.length === 0)}
                                        onChange={value => {
                                            setPassword(value)
                                            setMessage('')
                                        }}
                                        errorMessage={value => 'Введите пароль'}
                    />}
                    <div>
                        <button className={css.btnLogin}>Войти</button>
                        <div className={css.message}>{message}</div>
                    </div>
                </form>
                <Link to='/registration'>
                    <button className={css.btnRegistration}>Зарегистрироваться</button>
                </Link>
            </div>
        </div>
    )
}

export default FormLogin
