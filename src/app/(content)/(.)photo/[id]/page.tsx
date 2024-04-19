'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#eee',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '200px'
}));

export default function PhotoPageModalId({
    params: { id },
  }: {
    params: { id: string };
  }) {
    const router = useRouter();
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            router.push(`/photos`)
        }, 150)
    };

    return createPortal(
        <React.Fragment>
            <BootstrapDialog
                aria-labelledby="customized-dialog-title"
                fullWidth
                open={open}
                onClose={handleClose}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Item className="text-[32px] font-semibold hover:cursor-pointer mt-8">
                        {id}
                    </Item>
                </DialogContent>
            </BootstrapDialog>
        </React.Fragment>,
        document.getElementById('modal-root')!
    )
}