import { Redirect } from 'expo-router';

import { hrefSignUp } from '@/utils/hrefs';

export default function SignupPage() {
  return <Redirect href={hrefSignUp} />;
}
