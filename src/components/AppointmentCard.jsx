import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from '@mui/material';
import {
  Edit,
  Delete,
  CalendarToday,
  Schedule,
  Person,
  Phone
} from '@mui/icons-material';
import { deepPurple } from '@mui/material/colors';
import EditAppointmentDialog from './EditAppointmentDialog';

const getDoctorInitials = (doctorName) => {
  return doctorName
    .split(' ')
    .slice(0, 2)
    .map(name => name[0])
    .join('')
    .toUpperCase();
};

const getDepartmentColor = (department) => {
  const colors = {
    Cardiology: '#f44336',
    Dermatology: '#4caf50',
    Pediatrics: '#2196f3',
    'General Medicine': '#ff9800'
  };
  return colors[department] || deepPurple[500];
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (timeString) => {
  return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const AppointmentCard = ({ appointment, onCancel, onUpdate }) => {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleCancel = () => {
    onCancel(appointment.id);
    setCancelDialogOpen(false);
  };

  const handleUpdate = (updatedData) => {
    onUpdate(appointment.id, updatedData);
    setEditDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: getDepartmentColor(appointment.department) }}>
              {getDoctorInitials(appointment.doctor)}
            </Avatar>
          }
          title={appointment.doctor.split(' – ')[0]}
          subheader={appointment.department}
          action={
            <Chip 
              label={appointment.status} 
              color={appointment.status === 'Booked' ? 'primary' : 'default'}
              size="small"
            />
          }
        />
        
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Date & Time */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarToday color="action" fontSize="small" />
            <Typography variant="body1" fontWeight="medium">
              {formatDate(appointment.date)}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule color="action" fontSize="small" />
            <Typography variant="body1" fontWeight="medium">
              {formatTime(appointment.time)}
            </Typography>
          </Box>

          {/* Patient Info */}
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person color="action" fontSize="small" />
            <Typography variant="body2">
              {appointment.patientName}
            </Typography>
          </Box>

          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone color="action" fontSize="small" />
            <Typography variant="body2">
              {appointment.phoneNumber}
            </Typography>
          </Box>

          {appointment.email && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              📧 {appointment.email}
            </Typography>
          )}

          {/* Visit Type Chip */}
          <Chip
            label={appointment.visitType}
            color={appointment.visitType === 'New' ? 'secondary' : 'default'}
            size="small"
            sx={{ mb: 1 }}
          />

          {/* Symptoms/Notes */}
          {appointment.symptoms && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Notes:
              </Typography>
              <Typography variant="body2">
                {appointment.symptoms}
              </Typography>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Button
            size="small"
            startIcon={<Edit />}
            onClick={() => setEditDialogOpen(true)}
          >
            Edit
          </Button>
          <Button
            size="small"
            startIcon={<Delete />}
            color="error"
            onClick={() => setCancelDialogOpen(true)}
          >
            Cancel
          </Button>
        </CardActions>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this appointment with {appointment.doctor}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Keep</Button>
          <Button onClick={handleCancel} color="error" variant="contained">
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <EditAppointmentDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        appointment={appointment}
        onSave={handleUpdate}
      />
    </>
  );
};

export default AppointmentCard;