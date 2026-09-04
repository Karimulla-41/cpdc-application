export type Role = 'STUDENT' | 'EXECUTIVE' | 'STAFF_COORDINATOR' | 'ADMIN';
export const Role = {
  STUDENT: 'STUDENT' as Role,
  EXECUTIVE: 'EXECUTIVE' as Role,
  STAFF_COORDINATOR: 'STAFF_COORDINATOR' as Role,
  ADMIN: 'ADMIN' as Role,
};

export type ExecutiveDesignation = 'PRESIDENT' | 'VICE_PRESIDENT' | 'SECRETARY' | 'TREASURER' | 'EXECUTIVE_MEMBER';
export const ExecutiveDesignation = {
  PRESIDENT: 'PRESIDENT' as ExecutiveDesignation,
  VICE_PRESIDENT: 'VICE_PRESIDENT' as ExecutiveDesignation,
  SECRETARY: 'SECRETARY' as ExecutiveDesignation,
  TREASURER: 'TREASURER' as ExecutiveDesignation,
  EXECUTIVE_MEMBER: 'EXECUTIVE_MEMBER' as ExecutiveDesignation,
};

export type EventStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
export const EventStatus = {
  UPCOMING: 'UPCOMING' as EventStatus,
  COMPLETED: 'COMPLETED' as EventStatus,
  CANCELLED: 'CANCELLED' as EventStatus,
};

export type AttendanceStatus = 'PRESENT' | 'ABSENT';
export const AttendanceStatus = {
  PRESENT: 'PRESENT' as AttendanceStatus,
  ABSENT: 'ABSENT' as AttendanceStatus,
};

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export const Priority = {
  LOW: 'LOW' as Priority,
  MEDIUM: 'MEDIUM' as Priority,
  HIGH: 'HIGH' as Priority,
};
