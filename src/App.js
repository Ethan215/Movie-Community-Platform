import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Fetch from './Fetch';
import MovieDetail from './MovieDetail'; // Assume this is your new page component

function App(){
  return(
  <Router>
  <Routes>
    <Route path="/" element={<Fetch />} />
    <Route path="/movie/:id" element={<MovieDetail />} />
  </Routes>
</Router>
  )
}

export default App