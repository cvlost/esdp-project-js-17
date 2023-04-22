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

const usersPersistConfig = {
  key: 'ESDP-project-js-17:users',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  users: persistReducer(usersPersistConfig, usersReducer),
  city: cityReducer,
  region: regionReducer,
  directions: directionsReducer,
  locations: locationsReducer,
  format: formatReducer,
  area: areaReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
