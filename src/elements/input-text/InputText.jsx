import css from './InputText.module.css'
import { useState } from 'react'
import classnames from 'classnames'

const InputText = (props) => {
    const { placeholder, validate, errorMessage, onChange, isPassword = false, autofocus = false, isDate = false, inputValue } = props;

    let val = ''
    if (inputValue) val = inputValue
        
    const [value, setValue] = useState(val)
    const [firstTouch, setFirstTouch] = useState(true)

    let isInvalid = false
    if (validate) isInvalid = !firstTouch && validate(value);

    return (
        <div>
            <input
                type={isPassword ? 'password' : isDate ? 'date' : 'text'}
                className={classnames (css.input, {[css.input__error]: isInvalid})}
                autoFocus={autofocus}
                placeholder={placeholder}
                value={value}
                onBlur={(e) => { setFirstTouch(false)}}
                onChange={(e) => {
                    setValue(e.target.value)
                    if (onChange) {
                        onChange(e.target.value)
                    }
                }}
            />
            <div className={css.error}>
                {isInvalid && errorMessage && errorMessage(value)}
            </div>
        </div>
    )
}

export default InputText