import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { CssBaseline } from '@mui/material';
import Home from './containers/Home';
import Login from './containers/Login';

function App() {
  return (
    <>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={'Not found'} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
