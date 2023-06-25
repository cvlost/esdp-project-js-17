import React, { useCallback, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Chip,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Link,
  useMediaQuery,
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetLocationId, selectSelectedLocationId } from '../location/locationsSlice';
import { selectConstructor, selectUrl } from './commercialLinkSlice';
import ConstructorCard from './components/ConstructorCard';
import { green } from '@mui/material/colors';
import TitleIcon from '@mui/icons-material/Title';
import SimpleMdeReact from 'react-simplemde-editor';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import 'easymde/dist/easymde.min.css';
import { createCommLink } from './CommercialLinkThunk';
import ModalBody from '../../components/ModalBody';
import SnackbarCard from '../../components/SnackbarCard/SnackbarCard';
import { openSnackbar } from '../users/usersSlice';
import { Navigate } from 'react-router-dom';
import useConfirm from '../../components/Dialogs/Confirm/useConfirm';

const ConstructorLink = () => {
  const [open, setOpen] = useState(false);
  const listLocationId = useAppSelector(selectSelectedLocationId);
  const constructorLocation = useAppSelector(selectConstructor);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState({
    description: '',
    title: '',
  });
  const link = useAppSelector(selectUrl);
  const { confirm } = useConfirm();
  const matches = useMediaQuery('(min-width:600px)');
  const matches_500 = useMediaQuery('(min-width:500px)');

  const options = useMemo(() => {
    return {
      spellChecker: false,
      autofocus: true,
      placeholder: 'Введите текст...',
      status: false,
      autoSave: {
        enabled: true,
        delay: 1000,
      },
    };
  }, []);

  const onChangeDescription = useCallback((value: string) => {
    setValue((prev) => ({ ...prev, description: value }));
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const createCommercialLink = async () => {
    if (await confirm('Уведомление', 'Подвердите создание коммерческого предложения')) {
      const obj = {
        location: listLocationId,
        settings: constructorLocation,
        description: value.description ? value.description : null,
        title: value.title ? value.title : null,
      };
      await dispatch(createCommLink(obj)).unwrap();
      setOpen(true);
    } else {
      return;
    }
  };

  const handleCopy = async () => {
    try {
      if (link) {
        dispatch(resetLocationId());
        await navigator.clipboard.writeText(link.fullLink as string);
        dispatch(openSnackbar({ status: true, parameter: 'copy_link' }));
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (listLocationId.length === 0) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>
      <Box
        sx={{
          mt: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1 }}>
          <ConstructionIcon color="success" />
        </Avatar>
        <Typography component="h1" variant={matches_500 ? 'h5' : 'h6'}>
          Конструктор предложения
        </Typography>
        <Chip
          sx={{ fontSize: '20px', p: 3, marginRight: 'auto', mb: 2, width: !matches_500 ? '100%' : null }}
          label={'Выберите поля '}
          variant="outlined"
          color="info"
        />
        <Grid spacing={2} container>
          <ConstructorCard />
          <Grid xs={12} item>
            <Chip
              sx={{ fontSize: '20px', p: 3, marginRight: 'auto', mt: 2 }}
              label={'Ввести данные '}
              variant="outlined"
              color="info"
            />
            <Box component="form" sx={{ mt: 3, width: '100%' }}>
              <Grid container sx={{ flexDirection: 'column' }} spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex' }}>
                    {matches ? (
                      <Avatar sx={{ bgcolor: green[500], mr: 3, mb: 'auto' }}>
                        <TitleIcon />
                      </Avatar>
                    ) : null}
                    <TextField
                      label="Название организации"
                      name="title"
                      type="text"
                      autoComplete="current-password"
                      fullWidth
                      variant="outlined"
                      required
                      onChange={onChange}
                      value={value.title}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} display="flex">
                  {matches ? (
                    <Avatar sx={{ bgcolor: green[500], mr: 3, mb: 'auto' }}>
                      <ChatBubbleOutlineIcon />
                    </Avatar>
                  ) : null}
                  <SimpleMdeReact
                    options={options}
                    style={{ width: '100%' }}
                    value={value.description}
                    onChange={onChangeDescription}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item>
            <Button onClick={createCommercialLink} color="success" variant="contained" sx={{ mt: 3 }}>
              Создать предложение
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ModalBody isOpen={open} onClose={() => setOpen(true)}>
        <Grid container>
          <Grid item xs={12}>
            <Paper sx={{ p: 1 }} elevation={3}>
              <Link target="_blank" href={link?.fullLink || ''} underline="none">
                {link ? link.fullLink : 'Ссылка'}
              </Link>
            </Paper>
          </Grid>
          <Grid sx={{ mt: 2 }} item>
            <Button onClick={handleCopy} variant="outlined">
              Скопировать
            </Button>
          </Grid>
        </Grid>
        <SnackbarCard />
      </ModalBody>
    </Container>
  );
};

export default ConstructorLink;
