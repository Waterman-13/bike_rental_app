import css from './App.module.css'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Main from './components/main/Main'

function App() {

  return (
    <div className={css.app}>
      <Header />
      <Main />
      <Footer />
    </div>
  )
}

export default App;
