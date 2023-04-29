import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import logo from '../../images/logo (1).png';

const Footer = () => {
  return (
    <Paper component="footer" square variant="outlined" sx={{ padding: '30px', border: '1px dotted #252525' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            my: 1,
          }}
        >
          <div>
            <img src={logo} width="270px" height="65px" alt="Logo" />
          </div>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: 'center',
            display: 'flex',
            mb: 2,
          }}
        >
          <Typography variant="caption" color="initial">
            Дополнительная информация 2023@
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer;
