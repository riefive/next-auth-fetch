'use client';

import Link from 'next/link';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#eee',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '200px'
}));

export default function PhotosPage() {
    const photos = Array.from({ length: 6 }, (_, i) => i + 1);

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {photos.map((id, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <Link key={id} href={`/photo/${id}`} passHref>
                            <Item className="text-[32px] font-semibold hover:cursor-pointer">
                                {id}
                            </Item>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
