import isEmpty from 'lodash.isempty';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Box } from '@src/components/Box';
import { Stack } from '@src/components/Layouts';
import { BREADCRUMBS } from '@src/constants/breadcrumbs';
import { Text } from '@src/components/Text';

interface IBreadcrumbRoute {
  title: string;
  href?: string;
}

interface BreadcumbProps {
  routes?: Record<string, IBreadcrumbRoute>;
  children?: React.ReactElement;
}

const DYNAMIC_ROUTE_REGEX = /\[(.*?)\]/;

export function Breadcrumb(props: BreadcumbProps) {
  const { routes } = props;
  const router = useRouter();
  const { route, query } = router;
  const pathnames = route.split('/').filter((x) => x);

  return (
    <Stack direction="horizontal" gap="2" align="center">
      {route.length > 0 ? (
        <Text fontSize="baseText" fontWeight="baseText" color="static.grays.10">
          {BREADCRUMBS.HOME}
        </Text>
      ) : (
        <Text fontSize="baseText" fontWeight="baseText" color="static.blue">
          {BREADCRUMBS.HOME}
        </Text>
      )}
      {pathnames.map((name, index) => {
        if (!routes?.[name]) {
          return '';
        }

        const matchedDynamicPath = name.match(DYNAMIC_ROUTE_REGEX);

        // make TS hapy
        if (!isEmpty(matchedDynamicPath) && matchedDynamicPath) {
          const dynamicPathname = matchedDynamicPath[0];
          const queryPathName = matchedDynamicPath[1];
          if (!routes?.[dynamicPathname]) {
            return '';
          }

          const routeTo = `/${pathnames.slice(0, index).join('/')}/${
            query[queryPathName]
          }`;

          return (
            <Box key={name}>
              <span> / </span>
              <NextLink href={routeTo} passHref>
                <a>{query[queryPathName]}</a>
              </NextLink>
            </Box>
          );
        }

        if (name === 'brands' && query.categoryId) {
          const routeTo = `/categories/brands/${query.categoryId}`;

          return (
            <Box key={name}>
              <span> / </span>
              <NextLink href={routeTo} passHref>
                <a>{routes[name].title}</a>
              </NextLink>
            </Box>
          );
        }

        if (name === 'models' && query.brandId && query.categoryId) {
          const routeTo = `/categories/brands/${query.categoryId}/models/${query.brandId}`;

          return (
            <Box key={name}>
              <span> / </span>
              <NextLink href={routeTo} passHref>
                <a>{routes[name].title}</a>
              </NextLink>
            </Box>
          );
        }

        if (
          name === 'addons' &&
          query.categoryId &&
          query.brandId &&
          query.modelId
        ) {
          const routeTo = `/categories/brands/${query.categoryId}/models/${query.brandId}/addons/${query.modelId}`;

          return (
            <Box key={name}>
              <span> / </span>
              <NextLink href={routeTo} passHref>
                <a>{routes[name].title}</a>
              </NextLink>
            </Box>
          );
        }

        if (name === 'addons') {
          const routeTo = `/categories/addons`;

          return (
            <Box key={name}>
              <span> / </span>
              <NextLink href={routeTo} passHref>
                <a>{routes[name].title}</a>
              </NextLink>
            </Box>
          );
        }

        if (name === 'brands' && query.categoryId) {
          const routeTo = `/categories/brands/${query.categoryId}`;

          return (
            <Box key={name}>
              <span> / </span>
              <NextLink href={routeTo} passHref>
                <a>{routes[name].title}</a>
              </NextLink>
            </Box>
          );
        }

        if (name === 'models' && query.brandId && query.categoryId) {
          const routeTo = `/categories/brands/${query.categoryId}/models/${query.brandId}`;

          return (
            <Box key={name}>
              <span> / </span>
              <NextLink href={routeTo} passHref>
                <a>{routes[name].title}</a>
              </NextLink>
            </Box>
          );
        }

        if (
          name === 'addons' &&
          query.categoryId &&
          query.brandId &&
          query.modelId
        ) {
          const routeTo = `/categories/brands/${query.categoryId}/models/${query.brandId}/addons/${query.modelId}`;

          return (
            <Box key={name}>
              <span> / </span>
              <NextLink href={routeTo} passHref>
                <a>{routes[name].title}</a>
              </NextLink>
            </Box>
          );
        }

        const hasHref = routes?.[name].href;
        const routeTo =
          hasHref || `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <Box key={name}>
            <span> / </span>
            <NextLink href={routeTo} passHref>
              <a>{routes?.[name].title}</a>
            </NextLink>
          </Box>
        );
      })}
      {props.children}
    </Stack>
  );
}
