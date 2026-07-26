import './App.css';
// ==============================
//  className Base component Practice
// ==============================

import React, { Component } from 'react'
import Navbar from './Components/Navbar';
import News from './Components/News';
import About from './Components/About';
//react router 
import {
  BrowserRouter as Router,
  Routes,
  Route,
  
} from "react-router-dom";


export default class App extends Component {

  render() {

    return (
      <Router>
        <div>

          <Navbar />
          <Routes>
             <Route path="/About" element={<About />} />
             <Route key="/" path="/" element={<News country="PK" pageSize={8} category="general" />} />
            <Route  key="/science" path="/Science" element={<News country="PK" pageSize={8} category="science" />} />
            <Route  key="/general" path="/General" element={<News country="PK" pageSize={8} category="general" />} />
            <Route key="/entertainment" path="/Entertainment" element={<News country="PK" pageSize={8} category="entertainment" />} />
            <Route key="/health" path="/Health" element={<News country="PK" pageSize={8} category="health" />} />
            <Route key="/sports" path="/Sports" element={<News country="PK" pageSize={8} category="sports" />} />
            <Route key="/about" path="/About" element={<News country="PK" pageSize={8} category="general" />} />
            <Route key="/business" path="/Business" element={<News country="PK" pageSize={8} category="business" />} />
            <Route key="/technology" path="/Technology" element={<News country="PK" pageSize={8} category="technology" />} />
          </Routes>
        </div>
      </Router>
    )
  }
}
