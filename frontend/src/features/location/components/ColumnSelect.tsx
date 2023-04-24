import React from 'react';
import { Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material';
import { selectLocationsColumnSettings, toggleColumn } from '../locationsSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ColumnSelect = () => {
  const dispatch = useAppDispatch();
  const columns = useAppSelector(selectLocationsColumnSettings);
  const selectedColumnNames = columns.filter((col) => col.show).map((col) => col.prettyName);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="multiple-columns-label">Колонки</InputLabel>
        <Select
          size="small"
          labelId="multiple-columns-label"
          multiple
          value={selectedColumnNames}
          input={<OutlinedInput label="Колонки" />}
          MenuProps={MenuProps}
        >
          {columns.map((col) => (
            <MenuItem key={col.id} value={col.name} onClick={() => dispatch(toggleColumn(col.id))}>
              <Checkbox checked={col.show} />
              <ListItemText primary={col.prettyName} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ColumnSelect;
