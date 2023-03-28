export function isUserAdmin(user) {
  return Boolean(user?.httpsRideonsupersoundVercelAppRoles?.find((role) => role === 'admin'))
}
