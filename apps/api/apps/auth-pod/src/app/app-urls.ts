/** Frontend page users land on after finishing an OAuth flow (Gmail, HubSpot). */
export const appProfileUrl = () => process.env.APP_PROFILE_URL ?? 'http://localhost:3001/en/dashboard/profile';
