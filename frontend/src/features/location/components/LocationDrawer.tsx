import React from 'react';
import {
  Box,
  Checkbox,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectLocationsColumnSettings, toggleColumn } from '../locationsSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LocationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectLocationsColumnSettings);
  const locationCols = columns.filter((col) => col.type === 'location');
  const billboardCols = columns.filter((col) => col.type === 'billboard');

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <Typography textAlign="center" fontSize="1.2em">
          Колонки
        </Typography>
        <Divider sx={{ my: 1 }} />
        <List>
          <Typography color="gray" fontWeight="bold">
            Баннер
          </Typography>
          {billboardCols.map((col) => (
            <ListItem key={col.id} disablePadding onClick={() => dispatch(toggleColumn(col.id))}>
              <ListItemButton dense>
                <ListItemIcon>
                  <Checkbox edge="start" checked={col.show} />
                </ListItemIcon>
                <ListItemText primary={col.prettyName} />
              </ListItemButton>
            </ListItem>
          ))}
          <Typography color="gray" fontWeight="bold">
            Локация
          </Typography>
          {locationCols.map((col) => (
            <ListItem key={col.id} disablePadding onClick={() => dispatch(toggleColumn(col.id))}>
              <ListItemButton dense>
                <ListItemIcon>
                  <Checkbox edge="start" checked={col.show} />
                </ListItemIcon>
                <ListItemText primary={col.prettyName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default LocationDrawer;
