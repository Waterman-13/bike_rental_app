import css from './OfficersList.module.css'
import close from './close.png'
import { SERVER, REQUESTS, IS_MOCK_DATA } from '../../../const'
import { Link, Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setOfficers, setLoadedOfficers, deleteOfficer } from '../../../.store/actionCreators/officers'
import Header from '../../header/Header'
import OfficersListItem from '../list-item/OfficersListItem'
import data from '../../../mock-data.json'

const axios = require('axios').default

const OfficersList = () => {
    const dataOfficers = data.officers

    const user = useSelector(state => state.appReducer.activeUser)
    const token = useSelector(state => state.appReducer.activeToken)
    const officers = useSelector(state => state.officersReducer.officers)
    const loadedOfficers = useSelector(state => state.officersReducer.loadedOfficers)
    const dispatch = useDispatch()

    const _setOfficers = (data) => {
        if (data) dispatch(setOfficers(data))
        else dispatch(setOfficers([]))

        dispatch(setLoadedOfficers(true))
    }

    const _deleteOfficer = (id) => {
        dispatch(deleteOfficer(id))
    }

    if (!user) window.location.assign('/')

    if (!loadedOfficers) {
        if (!IS_MOCK_DATA) {
            if (token) {
                axios
                    .get(SERVER + REQUESTS.GET_OFFICERS, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        }
                    })
                    .then(response => {
                        if(response.data)  _setOfficers(response.data.officers)
                    })
                    .catch(error => {
                        if (error.response) {
                            let errMessage = ''
                            switch (error.response.status) {
                                default: errMessage = `Ошибка: ${error.response.status} - ${error.response.statusText}`
                            }
                            console.error(errMessage)
                            console.error(error.response)
                        } else {
                            console.error(error)
                        }
                    })
            } 
        } else {
            _setOfficers(dataOfficers)
        }
    }

    const handleDelete = (id) => {
        if (!IS_MOCK_DATA) {
            if (token) {
                axios
                    .delete(SERVER + REQUESTS.DELETE_OFFICER.replace(':id', id), {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        },
                    })
                    .then(response => {
                        if(response.data) _deleteOfficer(id)
                    })
                    .catch(error => {
                        if (error) {
                            console.error(error)
                        }
                    })
            }
        } else {
            _deleteOfficer(id)
        }
    }

    return (
        <>
            <Header />
            <div className={css.container}>
                <div className={css.title}>
                    <h1>Ответственные сотрудники</h1>
                    <Link to='/'>
                        <img src={close} alt='кнопка закрытия окна' title='Закрыть' className={css.close} />
                    </Link>
                </div>
                <div className={css.header}>
                    <div className={css.content}>
                        <div className={css.name}>Сотрудник</div>
                        <div className={css.email}>Email</div>
                        <div className={css.approved}>Одобрен</div>
                    </div>
                    <div className={css.icons}></div>
                </div>
                { !loadedOfficers && <div className={css.emptyList}>Загрузка...</div> }
                { loadedOfficers && officers.length === 0 && <div className={css.emptyList}>На данный момент нет ответственных сотрудников</div> }
                { loadedOfficers && <div className={css.item}>
                    {officers.map((item, index) => {
                        return <OfficersListItem key={item._id} index={index} handleDelete={handleDelete} {...item} />
                    })}
                </div>}
                <Outlet />
            </div>
        </>
    )
}

export default OfficersList

