import css from './CasesListItem.module.css'
import { STATUS_BIKE } from '../../../const'
import { dateToInput } from '../../../utils'
import icon_edit from './edit.png'
import icon_delete from './delete.png'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

const CasesListItem = (props) => {
    const { _id, index, status, licenseNumber, type, ownerFullName, color, date, handleDelete } = props

    const [isDeleting, setIsDeleting] = useState(false)

    const isOdd = index % 2 === 0
    const isNew = status === STATUS_BIKE.NEW
    const isDone = status === STATUS_BIKE.DONE

    const handleClick = () => {
        setIsDeleting(true)
        handleDelete(_id)
    }
    
    return (
        <div className={classnames(css.item, {[css.item_odd]: isOdd})}>
            <div className={css.content}>
                { isDeleting && <div>Удаление сообщения о краже...</div>}
                { !isDeleting && <div className={classnames(css.status, {[css.done]: isDone})}>
                    <span className={classnames({[css.status_new]: isNew})}>{status}</span>
                </div>}
                { !isDeleting && <div className={classnames(css.license, {[css.done]: isDone})}>{licenseNumber}</div>}
                { !isDeleting && <div className={classnames(css.type, {[css.done]: isDone})}>{type}</div>}
                { !isDeleting && <div className={classnames(css.name, {[css.done]: isDone})}>{ownerFullName}</div>}
                { !isDeleting && <div className={classnames(css.color, {[css.done]: isDone})}>{color}</div>}
                { !isDeleting && <div className={classnames(css.date, {[css.done]: isDone})}>{dateToInput(date)}</div> }
            </div>
            <div className={css.icons}>
                <div className={css.icon}>
                    <Link to={`/cases/${_id}`}>
                        <img src={icon_edit} className={css.imgEdit} title='Редактировать' alt='иконка edit' />
                    </Link>
                </div>
                <div className={css.icon}>
                    <img src={icon_delete} className={css.imgEdit} title='Удалить' alt='иконка delete' onClick={() => handleClick()} 
                    />
                </div>
            </div>
        </div>
    )
}

export default CasesListItem