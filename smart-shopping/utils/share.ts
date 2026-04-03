import { Share, Platform } from 'react-native';

import { withAffiliateParams } from '@/utils/affiliate';
import { APP_NAME } from '@/constants/env';

type ShareDealArgs = {
  title: string;
  targetUrl: string;
  messagePrefix?: string;
};

export async function shareDealLink({ title, targetUrl, messagePrefix }: ShareDealArgs): Promise<void> {
  const link = withAffiliateParams(targetUrl);
  const prefix = messagePrefix ?? `Save on ${title} with ${APP_NAME}`;
  const message = Platform.select({
    ios: `${prefix}\n${link}`,
    default: `${prefix}\n${link}`,
  });
  try {
    await Share.share({ message, title });
  } catch {
    /* user dismissed */
  }
}
