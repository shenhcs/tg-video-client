import React from 'react';
import { Box, Button } from '@mui/material';

const UploadActions = () => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
      <Button
        variant="contained"
        color="primary"
        component="label"
      >
        Upload Video
        <input
          type="file"
          hidden
          accept="video/*"
          onChange={(e) => {
            // TODO: Implement file upload
            console.log('File selected:', e.target.files?.[0]);
          }}
        />
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          // TODO: Implement cancel all uploads
        }}
      >
        Cancel All
      </Button>
    </Box>
  );
};

export default UploadActions; 