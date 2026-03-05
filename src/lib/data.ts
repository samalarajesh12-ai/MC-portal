
import {
  CalendarIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PillIcon,
  ReceiptTextIcon,
  StethoscopeIcon,
  ActivityIcon,
  UserCheckIcon,
  TrendingUpIcon
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
  TrendingUpIcon
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
    doctor: 'Dr. John Smith',
    department: 'Cardiology',
    date: '2024-08-15',
    time: '10:00 AM',
    status: 'Confirmed',
  },
  {
    id: 'app2',
    doctor: 'Dr. Sarah Jones',
    department: 'Dermatology',
    date: '2024-08-22',
    time: '02:30 PM',
    status: 'Confirmed',
  },
];

export const initialDoctors = [
  { 
    id: 'dr-smith', 
    firstName: 'John', 
    lastName: 'Smith', 
    specialty: 'Cardiology', 
    experience: 12, 
    email: 'dr.smith@maruthi.clinic', 
    password: '123',
    license: 'MC-882910'
  },
  { 
    id: 'dr-jones', 
    firstName: 'Sarah', 
    lastName: 'Jones', 
    specialty: 'Dermatology', 
    experience: 8, 
    email: 'dr.jones@maruthi.clinic', 
    password: '123',
    license: 'MC-771822'
  },
];
  
export const initialMedications = [
  {
    id: 1,
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once a day',
    refillsLeft: 2,
    lastRefill: '2024-07-10',
  },
  {
    id: 2,
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
  { id: 'bill001', service: 'Cardiology Consultation', date: '2024-08-15', amount: 250, status: 'Paid', paymentMethod: 'Debit Card' },
  { id: 'bill002', service: 'Blood Lab Work', date: '2024-07-30', amount: 1200, status: 'Paid', paymentMethod: 'UPI' },
];

export const bills = initialBills;
export const labResults = initialLabResults;
export const medicalHistory = initialMedicalHistory;
