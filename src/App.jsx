import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const initialAppointments = [
  {
    id: 1,
    patientName: 'John Doe',
    phoneNumber: '1234567890',
    email: 'john@example.com',
    doctor: 'Dr. Rao – Cardiology',
    department: 'Cardiology',
    date: '2024-02-15',
    time: '10:00',
    visitType: 'New',
    symptoms: 'Chest pain and shortness of breath',
    status: 'Booked'
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    phoneNumber: '9876543210',
    email: 'jane.smith@email.com',
    doctor: 'Dr. Meera – Dermatology',
    department: 'Dermatology',
    date: '2024-02-16',
    time: '14:30',
    visitType: 'Follow-up',
    symptoms: 'Skin rash follow-up examination',
    status: 'Booked'
  }
];

function App() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const addAppointment = (appointmentData) => {
    const newAppointment = {
      id: Date.now(),
      status: 'Booked',
      ...appointmentData
    };
    setAppointments(prev => [newAppointment, ...prev]);
    setSnackbar({ open: true, message: 'Appointment booked successfully!', severity: 'success' });
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    setSnackbar({ open: true, message: 'Appointment cancelled!', severity: 'info' });
  };

  const updateAppointment = (id, updatedData) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, ...updatedData } : app
    ));
    setSnackbar({ open: true, message: 'Appointment updated successfully!', severity: 'success' });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          Medical Appointments
        </Typography>
        
        <AppointmentForm onSubmit={addAppointment} />
        
        <Divider sx={{ my: 4 }} />
        
        <Box>
          <Typography variant="h5" component="h2" gutterBottom>
            Upcoming Appointments ({appointments.length})
          </Typography>
          <AppointmentList 
            appointments={appointments}
            onCancel={cancelAppointment}
            onUpdate={updateAppointment}
          />
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App;