import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';

const doctors = [
  { value: 'Dr. Rao – Cardiology', label: 'Dr. Rao – Cardiology', department: 'Cardiology' },
  { value: 'Dr. Meera – Dermatology', label: 'Dr. Meera – Dermatology', department: 'Dermatology' },
  { value: 'Dr. Arjun – Pediatrics', label: 'Dr. Arjun – Pediatrics', department: 'Pediatrics' },
  { value: 'Dr. Sharma – General Medicine', label: 'Dr. Sharma – General Medicine', department: 'General Medicine' },
];

const departments = ['Cardiology', 'Dermatology', 'Pediatrics', 'General Medicine'];

const EditAppointmentDialog = ({ open, onClose, appointment, onSave }) => {
  const [formData, setFormData] = useState({
    patientName: appointment.patientName,
    phoneNumber: appointment.phoneNumber,
    email: appointment.email || '',
    doctor: appointment.doctor,
    department: appointment.department,
    date: dayjs(appointment.date),
    time: dayjs(`2000-01-01T${appointment.time}`),
    visitType: appointment.visitType,
    symptoms: appointment.symptoms || ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
  };

  const handleTimeChange = (time) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const handleSubmit = () => {
    const updatedData = {
      ...formData,
      date: formData.date.format('YYYY-MM-DD'),
      time: formData.time.format('HH:mm')
    };
    onSave(updatedData);
  };

  const handleDoctorChange = (event) => {
    const selectedDoctor = doctors.find(doc => doc.value === event.target.value);
    setFormData(prev => ({
      ...prev,
      doctor: event.target.value,
      department: selectedDoctor ? selectedDoctor.department : ''
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Appointment</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Patient Name"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Doctor"
                name="doctor"
                value={formData.doctor}
                onChange={handleDoctorChange}
                required
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.value} value={doctor.value}>
                    {doctor.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Appointment Date"
                value={formData.date}
                onChange={handleDateChange}
                minDate={dayjs().add(1, 'day')}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TimePicker
                label="Appointment Time"
                value={formData.time}
                onChange={handleTimeChange}
                minTime={dayjs().set('hour', 9).set('minute', 0)}
                maxTime={dayjs().set('hour', 17).set('minute', 0)}
                slotProps={{ textField: { fullWidth: true, required: true } }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Visit Type</FormLabel>
                <RadioGroup
                  row
                  name="visitType"
                  value={formData.visitType}
                  onChange={handleChange}
                >
                  <FormControlLabel value="New" control={<Radio />} label="New" />
                  <FormControlLabel value="Follow-up" control={<Radio />} label="Follow-up" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Symptoms / Notes"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                inputProps={{ maxLength: 200 }}
                helperText={`${formData.symptoms.length}/200 characters`}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAppointmentDialog;