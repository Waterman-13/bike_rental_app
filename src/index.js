import React from 'react'
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './.store/store';
import './index.css'
import App from './App'
import PageNothingNever from './components/page-nothing-never/PageNothingNever'
import FormLogin from './components/form-login/FormLogin'
import FormSignup from './components/form-signup/FormSignup'
import FormNewCase from './components/form-newcase/FormNewCase'
import CasesList from './components/cases/list/CasesList'
import CaseContent from './components/case-content/CaseContent'
import OfficersList from './components/officers/list/OfficersList'
import OfficerContent from './components/officer-content/OfficerContent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}>
            <Route path='/auth' element={<FormLogin />} />
          </Route>
          <Route path='/registration' element={<FormSignup />} />
          <Route path='/newcase' element={<FormNewCase />} />
          <Route path='/cases' element={<CasesList />} />
          <Route path='/cases/:caseId' element={<CaseContent />} />
          <Route path='/officers' element={<OfficersList />} />
          <Route path='/officers/:officerId' element={<OfficerContent />} />
          <Route path='*' element={<PageNothingNever />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
