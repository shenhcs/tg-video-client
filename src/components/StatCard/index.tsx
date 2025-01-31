import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';

interface StatCardProps {
  title: string;
  value: number;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
  disabled?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description,
  onAction, 
  actionLabel,
  disabled = false
}) => {
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
          {description && (
            <Typography variant="body2" color="text.secondary" align="center">
              {description}
            </Typography>
          )}
          {onAction && actionLabel && (
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={onAction}
              disabled={disabled}
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