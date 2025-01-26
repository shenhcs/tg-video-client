import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';

const Settings = () => {
  const [settings, setSettings] = React.useState({
    telegramToken: '',
    chatId: '',
    autoUpload: true,
    maxFileSize: '100',
    defaultQuality: '720',
    notificationsEnabled: true,
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>Settings</Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>Telegram Settings</Typography>
            <TextField
              fullWidth
              label="Bot Token"
              value={settings.telegramToken}
              onChange={(e) => setSettings({ ...settings, telegramToken: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Chat ID"
              value={settings.chatId}
              onChange={(e) => setSettings({ ...settings, chatId: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Upload Settings</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoUpload}
                  onChange={(e) => setSettings({ ...settings, autoUpload: e.target.checked })}
                />
              }
              label="Auto Upload"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Max File Size (MB)"
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Default Quality (p)"
              type="number"
              value={settings.defaultQuality}
              onChange={(e) => setSettings({ ...settings, defaultQuality: e.target.value })}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>Notifications</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notificationsEnabled}
                  onChange={(e) => setSettings({ 
                    ...settings, 
                    notificationsEnabled: e.target.checked 
                  })}
                />
              }
              label="Enable Notifications"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              size="large"
              sx={{ mt: 2 }}
            >
              Save Settings
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Settings; 