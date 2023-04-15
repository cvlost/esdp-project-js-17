import React from 'react';
import { User } from '../types';
import { Button, Card, CardActions, Grid, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  user: User;
  onDelete: React.MouseEventHandler;
  onEditing: React.MouseEventHandler;
}

const CardUser: React.FC<Props> = ({ user, onDelete, onEditing }) => {
  return (
    <Card
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '20px',
        padding: '0 10px',
        boxShadow: '1px 0px 2px 1px',
      }}
    >
      <Grid sx={{ display: 'flex', flexWrap: 'wrap', width: '80%', justifyContent: 'space-between' }}>
        <Typography variant="subtitle1">
          почта: <b>{user.email}</b>
        </Typography>
        <Typography variant="subtitle1">
          имя: <b>{user.displayName}</b>
        </Typography>
        <Typography variant="subtitle1">
          роль : <b>{user.role}</b>
        </Typography>
      </Grid>
      <CardActions>
        <Button size="small" color="error" onClick={onDelete}>
          <DeleteIcon />
        </Button>
        <Button size="small" color="success" onClick={onEditing}>
          <EditIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardUser;
