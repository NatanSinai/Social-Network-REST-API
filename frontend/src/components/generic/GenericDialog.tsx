import { Close } from '@mui/icons-material';
import { Dialog, IconButton, Stack, Typography, type DialogProps, type StackProps } from '@mui/material';
import type { FC, PropsWithChildren, ReactNode } from 'react';

export type GenericDialogProps = PropsWithChildren<{
  title: ReactNode;
  isOpen: boolean;
  onClose: VoidFunction;
  dialogProps?: Partial<DialogProps>;
  mainStackProps?: Partial<StackProps>;
}>;

export const GenericDialog: FC<GenericDialogProps> = ({
  title,
  isOpen,
  onClose,
  children,
  dialogProps,
  mainStackProps,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth {...dialogProps}>
      <Stack direction='row' alignItems='center' justifyContent='space-between' bgcolor='secondary.main' p={1} pl={3}>
        <Typography variant='h6'>{title}</Typography>

        <IconButton onClick={onClose}>
          <Close sx={{ color: 'white' }} />
        </IconButton>
      </Stack>

      <Stack bgcolor='primary.main' px={3} py={1.5} {...mainStackProps}>
        {children}
      </Stack>
    </Dialog>
  );
};
