import React from 'react';
import { Container, Box } from '@mui/material';
import ClipCreator from '../../components/ClipCreator';

const CreateClipPage: React.FC = () => {
  const handleClipCreate = async (clipData: {
    video_id: string;
    start_time: number;
    end_time: number;
    output_name: string;
  }) => {
    try {
      const response = await fetch('http://localhost:8000/clips/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clipData),
      });

      if (!response.ok) {
        throw new Error('Failed to create clip');
      }

      // TODO: Add success notification and redirect to clips list
      console.log('Clip created successfully');
    } catch (error) {
      console.error('Error creating clip:', error);
      // TODO: Add error notification
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <ClipCreator onClipCreate={handleClipCreate} />
      </Box>
    </Container>
  );
};

export default CreateClipPage; 