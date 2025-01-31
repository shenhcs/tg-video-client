import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const VideoTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Path</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Clips</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Video rows will be added here */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VideoTable; 