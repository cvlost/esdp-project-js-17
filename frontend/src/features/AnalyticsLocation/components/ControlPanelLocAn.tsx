import React from 'react';
import { Chip, Grid, MenuItem, TextField } from '@mui/material';
import { MainColorGreen, YEAR } from '../../../constants';

interface Props {
  filterYearValue: string;
  setFilterYearValue: React.ChangeEventHandler;
}

const ControlPanelLocAn: React.FC<Props> = ({ filterYearValue, setFilterYearValue }) => {
  return (
    <Grid container alignItems="center" justifyContent="center" gap="10px" mb={2}>
      <Grid item>
        <Chip
          sx={{ fontSize: '20px', p: 3, color: MainColorGreen, my: 2 }}
          label={`Аналитика локаций за ${filterYearValue} год`}
          variant="outlined"
          color="success"
        />
      </Grid>
      <Grid item>
        <TextField
          select
          value={filterYearValue}
          color="success"
          name="filterYear"
          label="Выбор года"
          onChange={setFilterYearValue}
          sx={{ width: '300px', ml: 1 }}
        >
          <MenuItem value="" disabled>
            Выберите год
          </MenuItem>
          {YEAR.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default ControlPanelLocAn;
