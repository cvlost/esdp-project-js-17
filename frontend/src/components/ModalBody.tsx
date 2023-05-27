import React, { PropsWithChildren, ReactNode } from 'react';
import { Dialog, DialogContent, DialogProps } from '@mui/material';

interface Props extends PropsWithChildren {
  children: ReactNode;
  isOpen: boolean;
  onClose: React.MouseEventHandler;
  maxWidth?: DialogProps['maxWidth'];
}

const ModalBody: React.FC<Props> = ({ children, isOpen, onClose, maxWidth = undefined }) => {
  return (
    <Dialog sx={{ zIndex: '2' }} open={isOpen} onClose={onClose} fullWidth maxWidth={maxWidth}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default ModalBody;
