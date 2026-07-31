import './App.css';
// ==============================
//  className Base component Practice
// ==============================
import LoadingBar from "react-top-loading-bar";
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

  state={
    progress:0,
  }
  setProgress=(progress)=>{
    this.setState({progress:progress})

  }

  render() {

    return (
      <Router>
        <div>
           <LoadingBar
        color="#f11946"
        progress={this.state.progress}
        
      />
          <Navbar />
          <Routes>
             <Route path="/About" element={<About />} />
             {/* <Route key="/" path="/General" element={<News setProgress={this.setProgress} country="PK" pageSize={8} category="general" />} /> */}
            <Route  key="/science" path="/Science" element={<News setProgress={this.setProgress} country="PK" pageSize={8} category="science" />} />
            <Route  key="/general" path="/General" element={<News setProgress={this.setProgress} country="PK" pageSize={8} category="general" />} />
            <Route key="/entertainment" path="/Entertainment" element={<News setProgress={this.setProgress} country="PK" pageSize={8} category="entertainment" />} />
            <Route key="/health" path="/Health" element={<News setProgress={this.setProgress} country="PK" pageSize={8} category="health" />} />
            <Route key="/sports" path="/Sports" element={<News setProgress={this.setProgress} country="PK" pageSize={8} category="sports" />} />
            <Route key="/about" path="/About" element={<News setProgress={this.setProgress} country="PK" pageSize={8} category="general" />} />
            <Route key="/business" path="/Business" element={<News setProgress={this.setProgress} country="PK" pageSize={8} category="business" />} />
            <Route key="/technology" path="/Technology" element={<News setProgress={this.setProgress} country="PK" pageSize={8} category="technology" />} />
          </Routes>
        </div>
      </Router>
    )
  }
}
