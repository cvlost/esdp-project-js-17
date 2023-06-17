import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { CellObject, utils, WorkBook, WorkSheet, writeFile } from 'xlsx';
import { ILocation } from '../../types';

interface Props {
  data: ILocation[];
  loading: boolean;
}

const ExportToExcel: React.FC<Props> = ({ data, loading }) => {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');

  const changedData = data.map((obj) => {
    return {
      Направление: obj.direction,
      Область: obj.area,
      Район: obj.region,
      Улица: obj.streets,
      Город: obj.city,
      Адресс: obj.addressNote,
      Аренда: obj.booking,
      Цена: obj.price,
      Бронь: obj.rent,
      Размер: obj.size,
      Освещение: obj.lighting,
      Формат: obj.format,
      ЮрЛицо: obj.legalEntity,
    };
  });
  const handleClose = () => {
    setOpen(false);
  };

  const handleFileNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(event.target.value);
  };

  const handleEnterPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSave();
    }
  };

  const handleSave = () => {
    const worksheet: WorkSheet = utils.json_to_sheet(changedData);

    if (!worksheet['!cols']) {
      worksheet['!cols'] = [];
    }

    const rangeAddress = worksheet['!ref'];
    const range = rangeAddress ? utils.decode_range(rangeAddress) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };

    for (let col = range.s.c; col <= range.e.c; col++) {
      let maxWidth = 0;

      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = utils.encode_cell({ r: row, c: col });
        const cell: CellObject = worksheet[cellAddress];

        if (!cell) continue;

        const cellValue = utils.format_cell(cell) || '';
        const cellWidth = cellValue.length;

        if (cellWidth > maxWidth) {
          maxWidth = cellWidth;
        }
      }

      worksheet['!cols'][col] = maxWidth > 0 ? { wch: maxWidth + 1 } : { wch: 1 };
    }

    const workbook: WorkBook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    writeFile(workbook, fileName + '.xlsx');
    handleClose();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={loading}>
        Экспортировать в эксель
      </Button>
      <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box
          component="div"
          color="white"
          display="flex"
          justifyContent="center"
          flexDirection="column"
          alignItems="flex-baseline"
        >
          <Typography variant="h2">Сохранить как</Typography>
          <TextField
            sx={{ input: { color: 'white' } }}
            onChange={handleFileNameChange}
            onKeyDown={handleEnterPress}
            type="text"
            autoFocus
          />
          <Button sx={{ m: 2 }} variant="contained" onClick={handleSave}>
            Сохранить
          </Button>
          <Button sx={{ m: 2 }} variant="contained" onClick={handleClose}>
            Отмена
          </Button>
        </Box>
      </Modal>
    </>
  );
};
export default ExportToExcel;
