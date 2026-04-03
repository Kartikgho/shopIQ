import { Redirect } from 'expo-router';
import { SignedIn, SignedOut } from '@clerk/clerk-expo';

import { hrefHome, hrefSignIn } from '@/utils/hrefs';

export default function IndexPage() {
  return (
    <>
      <SignedIn>
        <Redirect href={hrefHome} />
      </SignedIn>
      <SignedOut>
        <Redirect href={hrefSignIn} />
      </SignedOut>
    </>
  );
}
