import React from 'react'
import './About.css'

const About = () => {

  return (
    <div className="about-container">
      <div className="about-header">
        <h1>📰 About QdPiNews</h1>
        <p>Your Trusted Source for Global News</p>
      </div>

      <div className="about-content">
        <div className="about-card">
          <div className="about-icon">🌍</div>
          <h3>Global Coverage</h3>
          <p>Get the latest news from around the world. We cover stories from every corner of the globe.</p>
        </div>

        <div className="about-card">
          <div className="about-icon">📊</div>
          <h3>Multiple Categories</h3>
          <p>From Sports to Technology, Health to Business - we've got all the categories you love.</p>
        </div>

        <div className="about-card">
          <div className="about-icon">⚡</div>
          <h3>Real-Time Updates</h3>
          <p>Stay updated with breaking news as it happens. Never miss an important story.</p>
        </div>

        <div className="about-card">
          <div className="about-icon">🔒</div>
          <h3>Trusted Sources</h3>
          <p>We aggregate news from reliable and verified sources to bring you accurate information.</p>
        </div>
      </div>

      <div className="about-features">
        <h2>✨ Features</h2>
        <ul>
          <li>📱 Responsive Design - Works on all devices</li>
          <li>🌙 Dark Mode Support</li>
          <li>📰 Real-time News Updates</li>
          <li>🏷️ Category-wise Filtering</li>
          <li>📄 Pagination for More Stories</li>
          <li>🔗 Read Full Articles with One Click</li>
        </ul>
      </div>

      <div className="about-footer">
        <p>Made by <strong>QdPiNews Team</strong></p>
        <p className="small-text">© 2026 QdPiNews - All Rights Reserved</p>
      </div>
    </div>
  )

}

export default About