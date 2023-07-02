import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { openSnackbar, selectSnackbarState } from '../../features/users/usersSlice';

const SnackbarCard = () => {
  const open = useAppSelector(selectSnackbarState);
  const dispatch = useAppDispatch();
  let txt = '';

  switch (open.parameter) {
    case 'remove':
      txt += 'Пользователь успешно удален';
      break;
    case 'edit':
      txt += 'Пользователь успешно отредактирован';
      break;
    case 'editProfile':
      txt += 'Ваш профиль успешно отредактирован';
      break;
    case 'create_region':
      txt += 'Регион успешно создан';
      break;
    case 'remove_region':
      txt += 'Регион успешно удален';
      break;
    case 'create_direction':
      txt += 'Сторона успешно создана';
      break;
    case 'remove_direction':
      txt += 'Сторона успешно удалена';
      break;
    case 'create_size':
      txt += 'Размер успешно создан';
      break;
    case 'remove_size':
      txt += 'Размер успешно удален';
      break;
    case 'create_lighting':
      txt += 'Освещение успешно создано';
      break;
    case 'remove_lighting':
      txt += 'Освещение успешно удалено';
      break;
    case 'create_area':
      txt += 'Область успешно создана';
      break;
    case 'remove_area':
      txt += 'Область успешно удалена';
      break;
    case 'create_format':
      txt += 'Формат успешно создан';
      break;
    case 'remove_format':
      txt += 'Формат успешно удален';
      break;
    case 'create_legal_entity':
      txt += 'Юридическое лицо успешно создано';
      break;
    case 'remove_legal_entity':
      txt += 'Юридическое лицо успешно удалено';
      break;
    case 'update_legal_entity':
      txt += 'Юридическое лицо успешно изменено';
      break;
    case 'remove_street':
      txt += 'Улица успешно удалена';
      break;
    case 'create_street':
      txt += 'Улица успешно создана';
      break;
    case 'create_city':
      txt += 'Город успешно создан';
      break;
    case 'remove_city':
      txt += 'Город успешно удален';
      break;
    case 'remove_locations':
      txt += 'Локация успешно удалена';
      break;
    case 'create_location':
      txt += 'Локация успешно создана';
      break;
    case 'edit_location':
      txt += 'Локация успешно отредактирована';
      break;
    case 'remove_client':
      txt += 'Клиент успешно удален';
      break;
    case 'create_client':
      txt += 'Клиент успешно сохранен';
      break;
    case 'create_booking':
      txt += 'Бронь успешно добавлена';
      break;
    case 'update_rent':
      txt += 'Информация об аренде обновлена';
      break;
    case 'delete_rentHistory':
      txt += 'История об аренде удалена';
      break;
    case 'Main_Edit':
      txt += ' успешно сохранено';
      break;
    case 'remove_link':
      txt += ' Ссылка успешно удалена';
      break;
  }

  return (
    <Snackbar
      open={open.status}
      autoHideDuration={6000}
      onClose={() => dispatch(openSnackbar({ status: false, parameter: '' }))}
    >
      <Alert
        onClose={() => dispatch(openSnackbar({ status: false, parameter: '' }))}
        severity="success"
        sx={{ width: '100%' }}
      >
        {txt}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarCard;
