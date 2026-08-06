import './App.css';
// ==============================
//  className Base component Practice
// ==============================
import LoadingBar from "react-top-loading-bar";
import React, { useState } from 'react'
import Navbar from './Components/Navbar';
import News from './Components/News';
import About from './Components/About';
//react router 
import {
  BrowserRouter as Router,
  Routes,
  Route,

} from "react-router-dom";


const App = () => {

  const apiKey = "pub_38580e65b08a403ba0067619e63d5d0c"

  const [progress, setProgress] = useState(0)



  return (
    <Router  >
      <div>
        <LoadingBar
          color="#f11946"
          progress={progress}

        />
        <Navbar />
        <Routes>
          <Route path="/" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={9} category="general" />} />
          <Route path="/About" element={<About />} />
          <Route key="/General" path="/General" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={9} category="general" />} />
          <Route key="/science" path="/Science" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={9} category="science" />} />
          <Route key="/general" path="/General" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={9} category="general" />} />
          <Route key="/entertainment" path="/Entertainment" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={9} category="entertainment" />} />
          <Route key="/health" path="/Health" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={9} category="health" />} />
          <Route key="/sports" path="/Sports" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={9} category="sports" />} />
          <Route key="/about" path="/About" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={9} category="general" />} />
          <Route key="/business" path="/Business" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={9} category="business" />} />
          <Route key="/technology" path="/Technology" element={<News setProgress={setProgress} apiKey={apiKey} pageSize={9} category="technology" />} />
        </Routes>
      </div>
    </Router>
  )

}

export default App