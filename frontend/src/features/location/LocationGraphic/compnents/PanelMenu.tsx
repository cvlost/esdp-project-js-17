import React from 'react';
import { Button, Grid, IconButton, MenuItem, TextField } from '@mui/material';
import { resetFilter, selectLocationsListData, setPerPage } from '../../locationsSlice';
import TuneIcon from '@mui/icons-material/Tune';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { YEAR } from '../../../../constants';
import BarChartIcon from '@mui/icons-material/BarChart';

interface Props {
  setIsFilterOpen: React.MouseEventHandler;
  setFilterYear: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterYear: string;
  setOpenBar: React.MouseEventHandler;
}

const PanelMenu: React.FC<Props> = ({ setIsFilterOpen, setFilterYear, filterYear, setOpenBar }) => {
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
      <Grid xs={3} item>
        <TextField
          fullWidth
          select
          size="small"
          variant="outlined"
          value={filterYear}
          onChange={setFilterYear}
          label="Выбрать год"
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
        <IconButton onClick={setIsFilterOpen} sx={{ ml: 1 }}>
          <TuneIcon />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={setOpenBar} sx={{ ml: 1 }}>
          <BarChartIcon />
        </IconButton>
      </Grid>
      <Grid item>
        {locationsListData.filtered && <Button onClick={() => dispatch(resetFilter())}>Сбросить фильтр</Button>}
      </Grid>
    </Grid>
  );
};

export default PanelMenu;
