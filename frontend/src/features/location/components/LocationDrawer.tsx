import React from 'react';
import {
  Box,
  Checkbox,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectLocationsColumnSettings, selectLocationsListData, setPerPage, toggleColumn } from '../locationsSlice';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LocationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectLocationsColumnSettings);
  const listData = useAppSelector(selectLocationsListData);
  const locationCols = columns.filter((col) => col.type === 'location');
  const billboardCols = columns.filter((col) => col.type === 'billboard');

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <Typography textAlign="center" fontSize="1.2em">
          Строки
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Grid container mb={2}>
          <Grid item pr={1}>
            <Typography color="gray" fontWeight="bold">
              Количество
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              select
              size="small"
              variant="standard"
              value={listData.perPage}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                dispatch(setPerPage(Number(event.target.value)))
              }
            >
              <MenuItem value="5">5</MenuItem>
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="15">15</MenuItem>
              <MenuItem value="25">25</MenuItem>
              <MenuItem value="50">50</MenuItem>
            </TextField>
          </Grid>
        </Grid>
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
