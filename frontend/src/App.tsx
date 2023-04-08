import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import Home from './containers/Home';
import AppToolbar from './components/AppToolbar/AppToolbar';
import Login from './containers/Login';

function App() {
  return (
    <>
      <CssBaseline />
      <header>
        <AppToolbar />
      </header>
      <Container maxWidth="xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={'Not found'} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
