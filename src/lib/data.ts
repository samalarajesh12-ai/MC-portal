
import {
  CalendarIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PillIcon,
  ReceiptTextIcon,
  StethoscopeIcon,
  ActivityIcon,
  UserCheckIcon,
  TrendingUpIcon,
  UsersIcon,
  CalendarCheckIcon,
  ClipboardListIcon,
  PlusCircleIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  iconName: keyof typeof iconMap;
};

export const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', iconName: 'LayoutDashboardIcon' },
  { href: '/appointments', label: 'Appointments', iconName: 'CalendarIcon' },
  { href: '/medications', label: 'Medications', iconName: 'PillIcon' },
  { href: '/records', label: 'Health Records', iconName: 'FileTextIcon' },
  { href: '/bills', label: 'Bills', iconName: 'ReceiptTextIcon' },
];

export const doctorNavItems: NavItem[] = [
  { href: '/dashboard', label: 'Performance', iconName: 'TrendingUpIcon' },
  { href: '/doctor/patients', label: 'Patient Management', iconName: 'UsersIcon' },
  { href: '/doctor/appointments', label: 'Appointment Scheduling', iconName: 'CalendarCheckIcon' },
  { href: '/doctor/records', label: 'Medical Records Access', iconName: 'ClipboardListIcon' },
  { href: '/doctor/prescriptions', label: 'Digital Prescriptions', iconName: 'PillIcon' },
  { href: '/doctor/operations', label: 'Operations History', iconName: 'ActivityIcon' },
  { href: '/doctor/attendance', label: 'Daily Attendance', iconName: 'UserCheckIcon' },
];

export const iconMap: { [key: string]: LucideIcon } = {
  LayoutDashboardIcon,
  CalendarIcon,
  PillIcon,
  FileTextIcon,
  ReceiptTextIcon,
  StethoscopeIcon,
  ActivityIcon,
  UserCheckIcon,
  TrendingUpIcon,
  UsersIcon,
  CalendarCheckIcon,
  ClipboardListIcon,
  PlusCircleIcon
};

export const doctorPerformance = {
  totalSurgeries: 142,
  successRate: 98.2,
  patientsSeen: 1250,
  attendancePercentage: 96.5,
  successByOperation: [
    { type: 'Bypass Surgery', rate: 97, count: 45 },
    { type: 'Valve Replacement', rate: 99, count: 32 },
    { type: 'Angioplasty', rate: 100, count: 65 },
  ]
};

export const previousOperations = [
  { id: 'op1', patient: 'Robert Fox', type: 'Coronary Bypass', date: '2024-02-10', outcome: 'Success', duration: '4h 20m' },
  { id: 'op2', patient: 'Jane Cooper', type: 'Heart Valve Repair', date: '2024-02-05', outcome: 'Success', duration: '3h 45m' },
  { id: 'op3', patient: 'Cody Fisher', type: 'Angioplasty', date: '2024-01-28', outcome: 'Success', duration: '1h 30m' },
  { id: 'op4', patient: 'Esther Howard', type: 'Pacemaker Insertion', date: '2024-01-15', outcome: 'Success', duration: '2h 00m' },
];

export const dailyAttendance = [
  { date: '2024-02-15', status: 'Present', shift: 'Day', hours: 9.5 },
  { date: '2024-02-14', status: 'Present', shift: 'Day', hours: 8.0 },
  { date: '2024-02-13', status: 'Present', shift: 'On-Call', hours: 12.0 },
  { date: '2024-02-12', status: 'Leave', shift: '-', hours: 0 },
  { date: '2024-02-11', status: 'Present', shift: 'Day', hours: 8.5 },
];

export const initialAppointments = [
  {
    id: 'app1',
    doctor: 'Dr. Raj Kumar',
    doctorId: 'dr-raj',
    patient: 'Robert Fox',
    patientId: 'p1',
    department: 'Cardiology',
    date: '2024-08-15',
    time: '10:00 AM',
    status: 'Confirmed',
  },
  {
    id: 'app2',
    doctor: 'Dr. Ramesh',
    doctorId: 'dr-ramesh',
    patient: 'Jane Cooper',
    patientId: 'p2',
    department: 'General Surgery',
    date: '2024-08-22',
    time: '02:30 PM',
    status: 'Confirmed',
  },
];

export const initialDoctors = [
  { 
    id: 'dr-raj', 
    firstName: 'Raj', 
    lastName: 'Kumar', 
    specialty: 'Cardiology', 
    experience: 15, 
    email: 'dr.raj@maruthi.clinic', 
    password: '123',
    license: 'MC-100201',
    contactNumber: '+91-90000-1111'
  },
  { 
    id: 'dr-ramesh', 
    firstName: 'Ramesh', 
    lastName: '', 
    specialty: 'General Surgery', 
    experience: 10, 
    email: 'dr.ramesh@maruthi.clinic', 
    password: '123',
    license: 'MC-200302',
    contactNumber: '+91-90000-2222'
  },
  { 
    id: 'dr-kumar', 
    firstName: 'Kumar', 
    lastName: '', 
    specialty: 'Pediatrics', 
    experience: 12, 
    email: 'dr.kumar@maruthi.clinic', 
    password: '123',
    license: 'MC-300403',
    contactNumber: '+91-90000-3333'
  },
  { 
    id: 'dr-smith', 
    firstName: 'John', 
    lastName: 'Smith', 
    specialty: 'Dermatology', 
    experience: 8, 
    email: 'dr.smith@maruthi.clinic', 
    password: '123',
    license: 'MC-882910',
    contactNumber: '+91-98822-1100'
  },
];
  
export const initialMedications = [
  {
    id: 'med1',
    patientId: 'p1',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once a day',
    refillsLeft: 2,
    lastRefill: '2024-07-10',
  },
  {
    id: 'med2',
    patientId: 'p2',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice a day',
    refillsLeft: 0,
    lastRefill: '2024-06-15',
  },
];

export const initialLabResults = [
  { id: 'lab001', testName: 'Complete Blood Count (CBC)', date: '2024-07-30', status: 'Normal' },
  { id: 'lab002', testName: 'Lipid Profile', date: '2024-07-30', status: 'Normal' },
];

export const initialMedicalHistory = {
  allergies: [{ name: 'Penicillin', reaction: 'Hives' }],
  surgeries: [{ name: 'Appendectomy', date: '2015' }],
  conditions: [{ name: 'Hypertension', diagnosed: '2020' }],
};

export const initialBills = [
  { 
    id: 'bill001', 
    service: 'Cardiology Consultation', 
    date: '2024-08-15', 
    amount: 2500, 
    status: 'Paid', 
    paymentMethod: 'Debit Card',
    surgicals: [
      { name: 'ECG Electrodes', count: 6 },
      { name: 'Sterile Swabs', count: 10 }
    ]
  },
  { 
    id: 'bill002', 
    service: 'Heart Bypass Surgery', 
    date: '2024-07-30', 
    amount: 150000, 
    status: 'Paid', 
    paymentMethod: 'UPI',
    surgicals: [
      { name: 'Surgical Sutures', count: 5 },
      { name: 'Vascular Graft', count: 1 },
      { name: 'Anesthesia Kit', count: 1 },
      { name: 'Surgical Blade', count: 2 }
    ]
  },
];
