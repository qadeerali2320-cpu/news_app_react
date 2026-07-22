import './App.css';
// ==============================
//  className Base component Practice
// ==============================

import React, { Component } from 'react'
import Navbar from './Components/Navbar';
import News from './Components/News';

export default class App extends Component {
   c ='Qadeer Ali';
  render() {
    
    return (
    <div>
      <Navbar/>
      <News/>
       
      </div>
    )
  }
}
