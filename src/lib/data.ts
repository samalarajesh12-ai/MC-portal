import {
  CalendarIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  PillIcon,
  ReceiptTextIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const patient = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
};

export type NavItem = {
  href: string;
  label: string;
  iconName: keyof typeof iconMap;
};

export const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', iconName: 'LayoutDashboardIcon' },
  { href: '/appointments', label: 'Appointments', iconName: 'CalendarIcon' },
  { href: '/medications', label: 'Medications', iconName: 'PillIcon' },
  { href: '/messages', label: 'Messages', iconName: 'MessageSquareIcon' },
  { href: '/records', label: 'Health Records', iconName: 'FileTextIcon' },
  { href: '/bills', label: 'Bills', iconName: 'ReceiptTextIcon' },
];

export const iconMap: { [key: string]: LucideIcon } = {
  LayoutDashboardIcon,
  CalendarIcon,
  PillIcon,
  MessageSquareIcon,
  FileTextIcon,
  ReceiptTextIcon,
};


export const appointments = [
  {
    id: 1,
    doctor: 'Dr. Smith',
    department: 'Cardiology',
    date: '2024-08-15',
    time: '10:00 AM',
    status: 'Confirmed',
  },
  {
    id: 2,
    doctor: 'Dr. Jones',
    department: 'Dermatology',
    date: '2024-08-22',
    time: '02:30 PM',
    status: 'Confirmed',
  },
];

export const doctors = [
    { id: 'dr-smith', name: 'Dr. John Smith', specialty: 'Cardiology' },
    { id: 'dr-jones', name: 'Dr. Sarah Jones', specialty: 'Dermatology' },
    { id: 'dr-chen', name: 'Dr. Wei Chen', specialty: 'Neurology' },
    { id: 'dr-patel', name: 'Dr. Anika Patel', specialty: 'Pediatrics' },
    { id: 'dr-williams', name: 'Dr. Ben Williams', specialty: 'General Surgery' },
    { id: 'dr-davis', name: 'Dr. Olivia Davis', specialty: 'Kidney Specialist' },
    { id: 'dr-roberts', name: 'Dr. Henry Roberts', specialty: 'Brain Surgeon' },
  ];
  

export const medications = [
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
    refillsLeft: 1,
    lastRefill: '2024-07-20',
  },
  {
    id: 3,
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once a day',
    refillsLeft: 0,
    lastRefill: '2024-06-25',
  },
];

export const messages = [
  {
    id: 1,
    sender: 'Dr. Smith',
    subject: 'Your recent test results',
    date: '2024-08-01',
    read: false,
    body: "Hello Jane, your recent lab results are in and everything looks normal. We'll discuss them in more detail at your next appointment. Best, Dr. Smith",
    conversation: [
        { from: "Dr. Smith", text: "Hello Jane, your recent lab results are in and everything looks normal. We'll discuss them in more detail at your next appointment. Best, Dr. Smith", time: "10:30 AM" },
        { from: "You", text: "That's great news, thank you Dr. Smith!", time: "11:00 AM" }
    ]
  },
  {
    id: 2,
    sender: 'Clinic Staff',
    subject: 'Appointment Reminder',
    date: '2024-07-30',
    read: true,
    body: 'This is a reminder for your upcoming appointment with Dr. Jones on August 22nd at 2:30 PM.',
    conversation: [
        { from: "Clinic Staff", text: "This is a reminder for your upcoming appointment with Dr. Jones on August 22nd at 2:30 PM.", time: "09:00 AM" },
    ]
  },
];

export const labResults = [
  {
    id: 'lab001',
    testName: 'Complete Blood Count (CBC)',
    date: '2024-07-30',
    status: 'Normal',
  },
  {
    id: 'lab002',
    testName: 'Lipid Panel',
    date: '2024-07-30',
    status: 'Normal',
  },
  {
    id: 'lab003',
    testName: 'Thyroid Stimulating Hormone (TSH)',
    date: '2024-06-15',
    status: 'Slightly Elevated',
  },
];

export const medicalHistory = {
  allergies: [
    { name: 'Penicillin', reaction: 'Hives' },
    { name: 'Pollen', reaction: 'Seasonal allergies' },
  ],
  surgeries: [
    { name: 'Appendectomy', date: '2015' },
    { name: 'Wisdom Teeth Removal', date: '2012' },
  ],
  conditions: [
    { name: 'Hypertension', diagnosed: '2020' },
    { name: 'Type 2 Diabetes', diagnosed: '2022' },
  ],
};

export const bills = [
    { id: 'bill001', service: 'Cardiology Consultation', date: '2024-08-15', amount: 250, status: 'Paid', paymentMethod: 'Debit Card' },
    { id: 'bill002', service: 'Dermatology Follow-up', date: '2024-08-22', amount: 150, status: 'Paid', paymentMethod: 'Insurance' },
    { id: 'bill003', service: 'Lab Work: Lipid Panel', date: '2024-07-30', amount: 75, status: 'Paid', paymentMethod: 'UPI' },
    { id: 'bill004', service: 'General Check-up', date: '2024-05-10', amount: 100, status: 'Paid', paymentMethod: 'Cash' },
    { id: 'bill005', service: 'X-Ray Imaging', date: '2024-09-01', amount: 300, status: 'Pending', paymentMethod: 'N/A' },
  ];
