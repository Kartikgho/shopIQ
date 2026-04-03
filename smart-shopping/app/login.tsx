import { Redirect } from 'expo-router';

import { hrefSignIn } from '@/utils/hrefs';

export default function LoginPage() {
  return <Redirect href={hrefSignIn} />;
}
