
import { useAuth } from '@/contexts/AuthContext';

export const useRoleAccess = () => {
  const { user } = useAuth();

  // For now, we'll use the user's role from user metadata
  // Later this can be expanded to check against a roles table
  const userRole = user?.user_metadata?.role || 'member';

  const isAdmin = userRole === 'admin';
  const isMember = userRole === 'member';

  // Admin can see all data, members have restricted access
  const canViewAllData = isAdmin;
  const canCreateData = isAdmin || isMember;
  const canEditData = isAdmin;
  const canDeleteData = isAdmin;

  return {
    userRole,
    isAdmin,
    isMember,
    canViewAllData,
    canCreateData,
    canEditData,
    canDeleteData,
  };
};
