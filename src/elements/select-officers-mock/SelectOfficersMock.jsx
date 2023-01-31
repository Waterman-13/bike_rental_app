import css from './SelectOfficersMock.module.css'
import data from '../../mock-data.json'
import { useState } from 'react'

const SelectOfficersMock = (props) => {
    const { inputValue, onChangeOfficer } = props
    const officersMock = data.officers.filter((item) => item.approved === true)
    const selectOfficers = officersMock

    const [value, setValue] = useState(inputValue ? inputValue : '')
    
    const onChange = (e) => {
        const name = e.target.value
        setValue(name)

        onChangeOfficer(name)
    }

    return (
        <>
            <select className={css.select} value={value} onChange={(e) => (onChange(e))}>
                <option></option>
                {selectOfficers.map((item) => {
                    return <option key={item._id}>{item.lastName + ' ' + item.firstName}</option>
                })}
            </select>
        </>
    )
}

export default SelectOfficersMock
