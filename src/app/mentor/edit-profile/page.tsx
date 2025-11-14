// src/app/mentor/edit-profile/page.tsx

import EditProfileClient from "./EditProfileClient";


export default function Page() {
  // You can pass server-fetched props here if you like.
  // For now the client pulls current user info from your Auth provider.
  return <EditProfileClient />;
}
