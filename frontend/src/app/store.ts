import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { usersReducer } from '../features/users/usersSlice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist/es/constants';
import { cityReducer } from '../features/location/city/citySlice';
import { regionReducer } from '../features/location/region/regionSlice';
import { locationsReducer } from '../features/location/locationsSlice';
import { areaReducer } from '../features/location/area/areaSlice';
import { formatReducer } from '../features/location/format/formatSlice';
import { directionsReducer } from '../features/location/direction/directionsSlice';
import { streetReducer } from '../features/location/street/streetSlice';
import { legalEntityReducer } from '../features/location/legalEntity/legalEntitySlice';
import { commercialLinkReducer } from '../features/CommercialLink/commercialLinkSlice';
import { sizesReducer } from '../features/location/size/sizeSlice';
import { lightingReducer } from '../features/location/lighting/lightingsSlice';
import { clientReducer } from '../features/location/client/clientSlice';
import { rentHistoryReducer } from '../features/rentHistory/rentHistorySlice';
import { analyticsClientReducer } from '../features/AnalyticsClient/AnalyticsClientSlice';
import notificationsMiddleware from './middleware/notificationsMiddleware';

const usersPersistConfig = {
  key: 'ESDP-project-js-17:users',
  storage,
  whitelist: ['user'],
};

const locationsPersistConfig = {
  key: 'ESDP-project-js-17:locations',
  storage,
  whitelist: ['settings', 'selectedLocationId'],
};

const commercialLinkPersistConfig = {
  key: 'ESDP-project-js-17:commercialLink',
  storage,
  whitelist: ['constructorLink'],
};

const rootReducer = combineReducers({
  users: persistReducer(usersPersistConfig, usersReducer),
  locations: persistReducer(locationsPersistConfig, locationsReducer),
  city: cityReducer,
  region: regionReducer,
  directions: directionsReducer,
  format: formatReducer,
  area: areaReducer,
  street: streetReducer,
  legalEntity: legalEntityReducer,
  commercialLink: persistReducer(commercialLinkPersistConfig, commercialLinkReducer),
  size: sizesReducer,
  lighting: lightingReducer,
  clients: clientReducer,
  rentHistories: rentHistoryReducer,
  analyticClient: analyticsClientReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).prepend(notificationsMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
