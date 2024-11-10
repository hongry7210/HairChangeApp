// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PhotoUpload from './components/PhotoUpload';
import HairStyleList from './components/HairStyleList';
import ResultView from './components/ResultView';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<PhotoUpload />} />
          <Route path="/hairstyles" element={<HairStyleList />} />
          <Route path="/result" element={<ResultView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
