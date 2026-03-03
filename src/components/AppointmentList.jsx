import React from 'react';
import { Grid, Typography } from '@mui/material';
import AppointmentCard from './AppointmentCard';

const AppointmentList = ({ appointments, onCancel, onUpdate }) => {
  if (appointments.length === 0) {
    return (
      <Typography variant="h6" color="text.secondary" align="center" sx={{ py: 4 }}>
        No appointments booked yet. Schedule your first appointment above!
      </Typography>
    );
  }

  return (
    <Grid container spacing={3}>
      {appointments.map((appointment) => (
        <Grid item xs={12} sm={6} lg={4} key={appointment.id}>
          <AppointmentCard
            appointment={appointment}
            onCancel={onCancel}
            onUpdate={onUpdate}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AppointmentList;