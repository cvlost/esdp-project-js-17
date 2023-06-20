import React from 'react';
import { Checkbox, Chip, FormControlLabel, FormGroup, Grid, MenuItem, TextField } from '@mui/material';
import { MainColorGreen, YEAR } from '../../../constants';

interface Props {
  filterYearValue: string;
  setFilterYearValue: React.ChangeEventHandler;
  setFilterDate: React.MouseEventHandler;
}

const ControlPanel: React.FC<Props> = ({ filterYearValue, setFilterYearValue, setFilterDate }) => {
  return (
    <Grid container alignItems="center" mb={2}>
      <Grid item>
        <Chip
          sx={{ fontSize: '20px', p: 3, color: MainColorGreen }}
          label={`Аналитика клиентов за ${filterYearValue} год`}
          variant="outlined"
          color="success"
        />
      </Grid>
      <Grid item>
        <TextField
          select
          value={filterYearValue}
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
      <Grid sx={{ ml: 1 }} item>
        <FormGroup aria-label="position" row>
          <FormControlLabel
            value="end"
            control={<Checkbox onClick={setFilterDate} />}
            label="Популярный клиент"
            labelPlacement="end"
          />
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default ControlPanel;
