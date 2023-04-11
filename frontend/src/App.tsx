import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './containers/Home';
import Login from './features/users/Login';
import CreateUser from './features/users/CreateUser';
import Users from './features/users/Users';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={'Not found'} />
        <Route path="/login" element={<Login />} />
        <Route path="/users" element={<Users />}>
          <Route path="createUser" element={<CreateUser />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
