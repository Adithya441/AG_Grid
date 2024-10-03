import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import MyAgGrid from './Aggrids';
import reportWebVitals from './reportWebVitals';
import { SideBar } from './Sidebar';
import CheckboxComponent from './sidebar2';
import Xyz from './sidebar2';
import GridComponent from './sidebar2';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    {/* <MyAgGrid/> */}
    <SideBar/> 
    {/* <GridComponent/> */}
    {/* <CheckboxComponent/> */}
    {/* <Xyz/> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
