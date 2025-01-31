import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number;
  onAction?: () => void;
  actionLabel?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, onAction, actionLabel }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" component="div" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" color="primary">
            {value}
          </Typography>
          {onAction && actionLabel && (
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={onAction}
              sx={{ mt: 2 }}
            >
              {actionLabel}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard; 