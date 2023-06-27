import React, { useState } from 'react';
import { apiURL, StyledTableRow } from '../../../constants';
import { Paper, TableCell, Typography } from '@mui/material';
import { AnalyticsLocationType } from '../../../types';
import { useNavigate } from 'react-router-dom';
import ModalBody from '../../../components/ModalBody';

interface Props {
  location: AnalyticsLocationType;
}

const AnalyticsLocationsCard: React.FC<Props> = ({ location }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const navigate = useNavigate();

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <StyledTableRow key={location._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="center">
        <img onClick={openImageModal} width="180px" src={apiURL + '/' + location.dayImage} alt={location._id} />
      </TableCell>
      <TableCell
        sx={{ cursor: 'pointer', width: '30%', textAlign: 'center' }}
        onClick={() => navigate(`/${location._id}`)}
        component="th"
        scope="row"
      >
        {location.locationName}
        {location.locationAddressNote && (
          <Typography color="gray" fontSize="14px">
            ({location.locationAddressNote})
          </Typography>
        )}
      </TableCell>
      <TableCell align="center" sx={{ width: '10%' }}>
        <Paper sx={{ background: '#ddd', p: 1 }}>{location.rentDay}</Paper>
      </TableCell>
      <TableCell align="center" sx={{ width: '10%' }}>
        <Paper sx={{ background: '#ddd', p: 1 }}>{location.overallPrice}</Paper>
      </TableCell>
      <TableCell align="center" sx={{ width: '10%' }}>
        <Paper sx={{ background: '#ddd', p: 1 }}>{location.overallBudget}</Paper>
      </TableCell>
      <TableCell align="center" sx={{ width: '10%' }}>
        <Paper sx={{ background: '#ddd', p: 1 }}>{location.rentPercent + '%'}</Paper>
      </TableCell>
      <TableCell align="center" sx={{ width: '10%' }}>
        <Paper sx={{ background: '#ddd', p: 1 }}>{location.financePercent + '%'}</Paper>
      </TableCell>
      <ModalBody isOpen={isImageModalOpen} onClose={closeImageModal}>
        <img src={apiURL + '/' + location.dayImage} alt={location._id} style={{ width: '100%' }} />
      </ModalBody>
    </StyledTableRow>
  );
};
export default AnalyticsLocationsCard;
