import css from './OfficersListItem.module.css'
import icon_edit from './edit.png'
import icon_delete from './delete.png'
import { SERVER, REQUESTS, IS_MOCK_DATA } from '../../../const'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { editOfficer } from '../../../.store/actionCreators/officers'
import classnames from 'classnames'

const axios = require('axios').default

const OfficersListItem = (props) => {
    const { _id, index, email, firstName, lastName, password, clientId, approved, handleDelete } = props
    const token = useSelector(state => state.appReducer.activeToken)

    let fullName = lastName + ' ' + firstName
    if (!lastName && !firstName) fullName = '<не определено>'

    const [isDeleting, setIsDeleting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [thisApproved, setThisApproved] = useState (approved)
    const [errorMsg, setErrorMsg] = useState('')
    const dispatch = useDispatch()

    const isOdd = index % 2 === 0

    const _editOfficer = (officer) => {
        dispatch(editOfficer(officer))
    }

    const handleDeleteClick = () => {
        setIsDeleting(true)
        handleDelete(_id)
    }

    const onChangeApproved = () => {
        setThisApproved(!thisApproved)

        const editOfficer = {
            _id: _id,
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
            clientId: clientId,
            approved: !thisApproved
        }

        if (!IS_MOCK_DATA) {
            if (token) {
                setIsSaving(true)
                axios
                    .put(SERVER + REQUESTS.PUT_OFFICER.replace(':id', editOfficer._id), 
                        { approved: editOfficer.approved }, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + token
                        }
                    })
                    .then(response => {
                        if(response.data) {
                            _editOfficer(response.data.data)
                            setIsSaving(false)
                        }
                    })  
                    .catch(error => {
                        if (error.response) {
                            let errMessage = ''
                            switch (error.response.status) {
                                default: errMessage = `Ошибка: ${error.response.status} - ${error.response.statusText}`
                            }
                            setErrorMsg(errMessage)
                            console.error(error.response)
                        } else {
                            console.error(error)
                        }
                    })
            }
        } else {
            _editOfficer(editOfficer)
        }
    }

    return (
        <div className={classnames(css.item, {[css.item_odd]: isOdd})}>
            { errorMsg && <div>`Ошибка сохранения: ${errorMsg}`</div>}
            { !errorMsg && <div className={css.content}>
                { isDeleting && <div>Удаление сотрудника...</div>}
                { isSaving && <div>Сохраняем данные сотрудника...</div>}
                { !isSaving && !isDeleting && <div className={css.name}>{fullName}</div>}
                { !isSaving && !isDeleting && <div className={css.email}>{email}</div>}
                { !isSaving && !isDeleting && <div className={css.approved}>
                    <input type='checkbox' checked={thisApproved} onChange={(e) => {onChangeApproved()}} />
                </div>}
            </div>}
            <div className={css.icons}>
                <div className={css.icon}>
                    <Link to={`/officers/${_id}`}>
                        <img src={icon_edit} className={css.imgEdit} title='Редактировать' alt='иконка edit' />
                    </Link>
                </div>
                <div className={css.icon}>
                    <img src={icon_delete} className={css.imgEdit} title='Удалить' alt='иконка delete' onClick={() => handleDeleteClick()} 
                    />
                </div>
            </div>
        </div>
    )
}

export default OfficersListItem