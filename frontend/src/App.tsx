import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './features/users/Login';
import CreateUser from './features/users/CreateUser';
import Users from './features/users/Users';
import Protected from './components/Protected';
import { useAppSelector } from './app/hooks';
import { selectUser } from './features/users/usersSlice';
import Location from './features/location/Location';
import CreateRegion from './features/location/region/CreateRegion';
import CreateDirection from './features/location/direction/CreateDirection';
import CreateArea from './features/location/area/CreateArea';
import CreateFormat from './features/location/format/CreateFormat';
import CreateLegalEntity from './features/location/legalEntity/CreateLegalEntity';
import CreateStreet from './features/location/street/CreateStreet';
import CreateCity from './features/location/city/CreateCity';
import CreateLocation from './features/location/CreateLocation';
import LocationPage from './features/location/components/LocationPage';
import CreateLighting from './features/location/lighting/CreateLighting';
import CreateSize from './features/location/size/CreateSize';
import ConstructorLink from './features/CommercialLink/ConstructorLink';
import CommercialLink from './features/CommercialLink/CommercialLink';
import CommercialLinkOne from './features/CommercialLink/CommercialLinkOne';
import CreateClient from './features/location/client/CreateClient';
import 'rsuite/dist/rsuite.min.css';
import RentHistoryList from './features/rentHistory/RentHistoryList';

function App() {
  const user = useAppSelector(selectUser);
  return (
    <Layout>
      <Routes>
        <Route path="*" element={'Not found'} />
        <Route path="/link/:id" element={<CommercialLink />} />
        <Route path="/location/:idLink/locationOne/:idLoc" element={<CommercialLinkOne />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Protected userRole={user?.role} priority="admin" />}>
          <Route path="/users" element={<Users />}>
            <Route path="createUser" element={<CreateUser />} />
          </Route>
        </Route>

        <Route element={<Protected userRole={user?.role} priority="user" />}>
          <Route path="/" element={<Location />} />
          <Route path="/:id" element={<LocationPage />} />
          <Route path="/rentHistory/:id" element={<RentHistoryList />} />
        </Route>
        <Route element={<Protected userRole={user?.role} priority="admin" />}>
          <Route path="/create_size" element={<CreateSize />} />
          <Route path="/create_location" element={<CreateLocation />} />
          <Route path="/create_region" element={<CreateRegion />} />
          <Route path="/create_lighting" element={<CreateLighting />} />
          <Route path="/create_city" element={<CreateCity />} />
          <Route path="/create_direction" element={<CreateDirection />} />
          <Route path="/create_format" element={<CreateFormat />} />
          <Route path="/create_area" element={<CreateArea />} />
          <Route path="/create_legal_entity" element={<CreateLegalEntity />} />
          <Route path="/create_street" element={<CreateStreet />} />
          <Route path="/create_client" element={<CreateClient />} />
          <Route path="/constructor_link" element={<ConstructorLink />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;
