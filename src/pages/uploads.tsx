import React from 'react';
import { Box, Typography } from '@mui/material';
import UploadStats from '../components/Uploads/UploadStats';
import UploadActions from '../components/Uploads/UploadActions';
import UploadTable from '../components/Uploads/UploadTable';

const Uploads = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Uploads
      </Typography>
      
      <UploadStats />
      <UploadActions />
      <UploadTable />
    </Box>
  );
};

export default Uploads; 