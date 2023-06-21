import React from 'react';
import { Box, Button, Grid, IconButton, MenuItem, TextField } from '@mui/material';
import { resetFilter, selectLocationsListData, setPerPage } from '../../locationsSlice';
import TuneIcon from '@mui/icons-material/Tune';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';

interface Props {
  setIsFilterOpen: React.MouseEventHandler;
}

const PanelMenu: React.FC<Props> = ({ setIsFilterOpen }) => {
  const dispatch = useAppDispatch();
  const listData = useAppSelector(selectLocationsListData);
  const locationsListData = useAppSelector(selectLocationsListData);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        select
        size="small"
        variant="outlined"
        value={listData.perPage}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => dispatch(setPerPage(Number(event.target.value)))}
      >
        <MenuItem value="5">5</MenuItem>
        <MenuItem value="10">10</MenuItem>
        <MenuItem value="15">15</MenuItem>
        <MenuItem value="25">25</MenuItem>
        <MenuItem value="50">50</MenuItem>
      </TextField>
      <Grid item>
        <IconButton onClick={setIsFilterOpen} sx={{ ml: 1 }}>
          <TuneIcon />
        </IconButton>
      </Grid>
      {locationsListData.filtered && (
        <Grid item>
          <Button onClick={() => dispatch(resetFilter())}>Сбросить фильтр</Button>
        </Grid>
      )}
    </Box>
  );
};

export default PanelMenu;
