import css from './CasesList.module.css'
import close from './close.png'
import { SERVER, REQUESTS, IS_MOCK_DATA } from '../../../const'
import { Link, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCases, setLoadedCases, deleteCase } from '../../../.store/actionCreators/cases'
import Header from '../../header/Header'
import CasesListItem from '../list-item/CasesListItem'
import data from '../../../mock-data.json'

const axios = require('axios').default

const CasesList = () => {
    const dataCases = data.cases

    const user = useSelector(state => state.appReducer.activeUser)
    const token = useSelector(state => state.appReducer.activeToken)
    const cases = useSelector(state => state.casesReducer.cases)
    const loadedCases = useSelector(state => state.casesReducer.loadedCases)
    const dispatch = useDispatch()

    const _setCases = (data) => {
        if (data) dispatch(setCases(data))
        else dispatch(setCases([]))

        dispatch(setLoadedCases(true))
    }

    const _deleteCase = (id) => {
        dispatch(deleteCase(id))
    }

    if (!user) window.location.assign('/')

    if (!loadedCases) {
        if (!IS_MOCK_DATA) {
            if (token) {
                axios
                    .get(SERVER + REQUESTS.GET_CASES, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        }
                    })
                    .then(response => {
                        if(response.data)  _setCases(response.data.data)
                    })
                    .catch(error => {
                        if (error.response) {
                            let errMessage = ''
                            switch (error.response.status) {
                                default: errMessage = `Ошибка: ${error.response.status} - ${error.response.statusText}`
                            }
                            console.error(errMessage)
                        } else {
                            console.error(error)
                        }
                    })
            } 
        } else {
            _setCases(dataCases)
        }
    }

    const handleDelete = (id) => {
        if (!IS_MOCK_DATA) {
            if (token) {
                axios
                    .delete(SERVER + REQUESTS.DELETE_CASE.replace(':id', id), {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        },
                    })
                    .then(response => {
                        if(response.data) _deleteCase(id)
                    })
                    .catch(error => {
                        if (error) {
                            console.error(error)
                        }
                    })
            }
        } else {
            _deleteCase(id)
        }
    }

    return (
        <>
            <Header />
            <div className={css.container}>
                <div className={css.title}>
                    <h1>Сообщения о кражах</h1>
                    <Link to='/'>
                        <img src={close} alt='кнопка закрытия окна' title='Закрыть' className={css.close} />
                    </Link>
                </div>
                <div className={css.header}>
                    <div className={css.content}>
                        <div className={css.status}>Статус сообщения</div>
                        <div className={css.license}>Номер лицензии</div>
                        <div className={css.type}>Тип велосипеда</div>
                        <div className={css.name}>ФИО пользователя (арендатора велосипеда)</div>
                        <div className={css.color}>Цвет велосипеда</div>
                        <div className={css.date}>Дата кражи</div>
                    </div>
                    <div className={css.icons}></div>
                </div>
                { !loadedCases && <div className={css.emptyList}>Загрузка...</div> }
                { loadedCases && cases.length ===0 && <div className={css.emptyList}>На данный момент нет зарегестрированных случаев краж велосипедов</div> }
                { loadedCases && <div className={css.item}>
                    {cases.map((item, index) => {
                        return <CasesListItem key={item._id} index={index} handleDelete={handleDelete} {...item} />
                    })}
                </div>}
                <Outlet />
            </div>
        </>
    )
}

export default CasesList

