export interface User {
  id?: number;
  email: string;
  full_name: string;
  isActive?: boolean;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  dateOfBirth?: Date | null;
  profilePictureUrl?: string | null;
  darkMode?: boolean;
  notificationsEnabled?: boolean;
  newsletterSubscribed?: boolean;
}
