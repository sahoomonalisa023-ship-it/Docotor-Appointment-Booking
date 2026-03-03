import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  Box,
  Alert
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

const initialFormState = {
  patientName: '',
  phoneNumber: '',
  email: '',
  doctor: '',
  department: '',
  date: null,
  time: null,
  visitType: 'New',
  symptoms: '',
  consent: false
};

const initialErrors = {
  patientName: '',
  phoneNumber: '',
  email: '',
  doctor: '',
  department: '',
  date: '',
  time: '',
  consent: ''
};

const AppointmentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'patientName':
        return value.trim() ? '' : 'Patient name is required';
      case 'phoneNumber':
        return /^\d{10}$/.test(value) ? '' : 'Phone number must be 10 digits';
      case 'email':
        return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format';
      case 'doctor':
        return value ? '' : 'Please select a doctor';
      case 'department':
        return value ? '' : 'Please select a department';
      case 'date':
        return value && dayjs(value).isAfter(dayjs(), 'day') ? '' : 'Please select a future date';
      case 'time':
        return value ? '' : 'Please select a time';
      case 'consent':
        return value ? '' : 'You must agree to clinic policies';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, type === 'checkbox' ? checked : value)
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, date }));
    if (touched.date) {
      setErrors(prev => ({ ...prev, date: validateField('date', date) }));
    }
  };

  const handleTimeChange = (time) => {
    setFormData(prev => ({ ...prev, time }));
    if (touched.time) {
      setErrors(prev => ({ ...prev, time: validateField('time', time) }));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name]) }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (validateForm()) {
      const submissionData = {
        ...formData,
        date: formData.date.format('YYYY-MM-DD'),
        time: formData.time.format('HH:mm')
      };
      onSubmit(submissionData);
      setFormData(initialFormState);
      setTouched({});
      setErrors(initialErrors);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setTouched({});
    setErrors(initialErrors);
  };

  const handleDoctorChange = (event) => {
    const selectedDoctor = doctors.find(doc => doc.value === event.target.value);
    setFormData(prev => ({
      ...prev,
      doctor: event.target.value,
      department: selectedDoctor ? selectedDoctor.department : ''
    }));

    if (touched.doctor) {
      setErrors(prev => ({
        ...prev,
        doctor: validateField('doctor', event.target.value),
        department: validateField('department', selectedDoctor ? selectedDoctor.department : '')
      }));
    }
  };

  const isSubmitDisabled = () => {
    return Object.keys(formData).some(key => {
      if (key === 'email' || key === 'symptoms') return false;
      if (key === 'consent') return !formData[key];
      return !formData[key];
    }) || Object.values(errors).some(error => error);
  };

  return (
    <Card>
      <CardHeader
        title="Book Appointment"
        titleTypographyProps={{ variant: 'h4', color: 'primary' }}
      />
      <CardContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Patient Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Patient Name"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.patientName}
                  helperText={errors.patientName}
                  required
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber || '10 digits required'}
                  required
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.email}
                  helperText={errors.email || 'Optional'}
                />
              </Grid>

              {/* Doctor Selection */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Doctor"
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleDoctorChange}
                  onBlur={handleBlur}
                  error={!!errors.doctor}
                  helperText={errors.doctor}
                  required
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.value} value={doctor.value}>
                      {doctor.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Department */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!errors.department}
                  helperText={errors.department}
                  required
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Date Picker */}
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Appointment Date"
                  value={formData.date}
                  onChange={handleDateChange}
                  minDate={dayjs().add(1, 'day')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.date,
                      helperText: errors.date,
                      onBlur: () => handleBlur({ target: { name: 'date' } }),
                      required: true
                    }
                  }}
                />
              </Grid>

              {/* Time Picker */}
              <Grid item xs={12} md={6}>
                <TimePicker
                  label="Appointment Time"
                  value={formData.time}
                  onChange={handleTimeChange}
                  minTime={dayjs().set('hour', 9).set('minute', 0)}
                  maxTime={dayjs().set('hour', 17).set('minute', 0)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.time,
                      helperText: errors.time || 'Clinic hours: 09:00 - 17:00',
                      onBlur: () => handleBlur({ target: { name: 'time' } }),
                      required: true
                    }
                  }}
                />
              </Grid>

              {/* Visit Type */}
              <Grid item xs={12} md={6}>
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

              {/* Symptoms/Notes */}
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

              {/* Consent Checkbox */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  }
                  label="I agree to clinic policies"
                />
                {errors.consent && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {errors.consent}
                  </Alert>
                )}
              </Grid>

              {/* Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleReset}
                    size="large"
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitDisabled()}
                    size="large"
                  >
                    Book Appointment
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </LocalizationProvider>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;