import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { CellObject, utils, WorkBook, WorkSheet, writeFile } from 'xlsx';
import { ILocation } from '../../types';
import GetAppIcon from '@mui/icons-material/GetApp';
import ModalBody from '../../components/ModalBody';

interface Props {
  data: ILocation[];
}

const ExportToExcel: React.FC<Props> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');

  const changedData = data.map((obj) => {
    return {
      Сторона: obj.direction,
      Область: obj.area,
      Район: obj.region,
      Улица: obj.streets,
      Город: obj.city,
      Адрес: obj.addressNote,
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
    writeFile(workbook, fileName.trim() !== '' ? fileName.trim() + '.xlsx' : 'Шамдагай документ.xlsx');
    handleClose();
  };

  return (
    <>
      <Button color="success" variant="contained" onClick={() => setOpen(true)}>
        <GetAppIcon sx={{ mr: 1 }} />
        Экспортировать в эксель
      </Button>

      <ModalBody isOpen={open} onClose={handleClose}>
        <Box component="div" display="flex" justifyContent="center" flexDirection="column" alignItems="flex-baseline">
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
            Сохранить как
          </Typography>
          <TextField
            color="success"
            label="Имя документа"
            autoComplete="off"
            onChange={handleFileNameChange}
            onKeyDown={handleEnterPress}
            type="text"
            autoFocus
          />
          <Button sx={{ m: 2 }} variant="contained" color="success" onClick={handleSave}>
            Сохранить
          </Button>
          <Button sx={{ m: 2 }} variant="contained" color="success" onClick={handleClose}>
            Отмена
          </Button>
        </Box>
      </ModalBody>
    </>
  );
};
export default ExportToExcel;
