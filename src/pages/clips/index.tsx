import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ClipsPage = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: 'Create Clip',
      description: 'Create a new clip from a video',
      path: '/clips/create'
    },
    {
      title: 'Pending Clips',
      description: 'View clips waiting to be processed',
      path: '/clips/pending'
    },
    {
      title: 'Processing Clips',
      description: 'View clips currently being processed',
      path: '/clips/processing'
    },
    {
      title: 'Completed Clips',
      description: 'View completed and uploaded clips',
      path: '/clips/completed'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Clips</Typography>
      
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={3} key={section.path}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {section.description}
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate(section.path)}
                >
                  View
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClipsPage; 