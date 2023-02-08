import css from './Footer.module.css'
//import { useSelector } from 'react-redux'

const Footer = () => {
    //const user = useSelector(state => state.appReducer.activeUser)

    return (
        <footer className={css.footer}>
            <div className={css.content}>
                <div>На странице использованы иконки и изображения с Freepik</div>
            </div>
        </footer>
    )
}

export default Footer