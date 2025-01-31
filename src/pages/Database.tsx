import React from 'react';
import { Box, Typography } from '@mui/material';
import DatabaseStats from '../components/database/DatabaseStats';
import DatabaseActions from '../components/database/DatabaseActions';
import DatabaseTable from '../components/database/DatabaseTable';

const Database = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Database
      </Typography>
      
      <DatabaseStats />
      <DatabaseActions />
      <DatabaseTable />
    </Box>
  );
};

export default Database; 