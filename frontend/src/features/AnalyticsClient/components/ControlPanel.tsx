import React from 'react';
import { Checkbox, Chip, FormControlLabel, FormGroup, Grid, IconButton, MenuItem, TextField } from '@mui/material';
import { MainColorGreen, YEAR } from '../../../constants';
import BarChartIcon from '@mui/icons-material/BarChart';

interface Props {
  filterYearValue: string;
  setFilterYearValue: React.ChangeEventHandler;
  setFilterDate: React.MouseEventHandler;
  setOpen: React.MouseEventHandler;
}

const ControlPanel: React.FC<Props> = ({ filterYearValue, setFilterYearValue, setFilterDate, setOpen }) => {
  return (
    <Grid spacing={1} container alignItems="center" mb={4}>
      <Grid item mt={2}>
        <Chip
          sx={{ fontSize: '20px', minWidth: '250px', p: 3, color: MainColorGreen, mb: 2 }}
          label={`Аналитика клиентов за ${filterYearValue} год`}
          variant="outlined"
          color="success"
        />
      </Grid>
      <Grid xs={8} lg={2} item>
        <TextField
          select
          fullWidth
          value={filterYearValue}
          name="filterYear"
          color="success"
          label="Выбор года"
          onChange={setFilterYearValue}
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
      <Grid item>
        <IconButton onClick={setOpen} sx={{ ml: 1 }}>
          <BarChartIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default ControlPanel;
