import NextLink from 'next/link';

import { Box } from '@src/components/Box';
import { Stack } from '@src/components/Layouts';

import { ActionIconLink } from './ActionIconLink';

type ActionProps = {
  firstIcon: React.ReactNode;
  firstIconText: string;
  secondIcon: React.ReactNode;
  secondIconText: string;
  secondPathDownloadLink?: string;
  firstPathName: string;
  secondPathName: string;
  search?: string;
};

export function Action({
  firstIcon,
  firstIconText,
  firstPathName,
  secondIcon,
  secondIconText,
  secondPathName,
  secondPathDownloadLink,
  search,
}: ActionProps) {
  return (
    <Box
      cssProps={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        blockSize: '100%',
      }}
    >
      <Stack gap="8">
        <NextLink
          href={{
            pathname: firstPathName,
          }}
          passHref
        >
          <ActionIconLink>
            {firstIcon}
            {firstIconText}
          </ActionIconLink>
        </NextLink>

        {secondPathDownloadLink ? (
          <ActionIconLink
            href={`https://${secondPathDownloadLink}`}
            download
            target="_blank"
          >
            {secondIcon}
            {secondIconText}
          </ActionIconLink>
        ) : (
          <NextLink
            href={{
              pathname: secondPathName,
              query: {
                search: search,
              },
            }}
            passHref
          >
            <ActionIconLink>
              {secondIcon}
              {secondIconText}
            </ActionIconLink>
          </NextLink>
        )}
      </Stack>
    </Box>
  );
}
