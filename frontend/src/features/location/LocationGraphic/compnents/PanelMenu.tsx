import React from 'react';
import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { resetFilter, selectLocationsListData } from '../../locationsSlice';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { YEAR } from '../../../../constants';
import { setPerPage } from '../locationGraphicSlice';

interface Props {
  setFilterYear: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterYear: string;
}

const PanelMenu: React.FC<Props> = ({ setFilterYear, filterYear }) => {
  const dispatch = useAppDispatch();
  const listData = useAppSelector(selectLocationsListData);
  const locationsListData = useAppSelector(selectLocationsListData);
  return (
    <Grid container alignItems="center" mb={1}>
      <Grid item>
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
      </Grid>
      <Grid xs={3} item sx={{ ml: 1 }}>
        <TextField
          fullWidth
          select
          size="small"
          variant="outlined"
          label="Выбрать год"
          onChange={setFilterYear}
          value={filterYear}
        >
          <MenuItem disabled value="">
            Выбрать год
          </MenuItem>
          {YEAR.map((year) => (
            <MenuItem key={year} value={year.toString()}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item>
        {locationsListData.filtered && <Button onClick={() => dispatch(resetFilter())}>Сбросить фильтр</Button>}
      </Grid>
    </Grid>
  );
};

export default PanelMenu;
