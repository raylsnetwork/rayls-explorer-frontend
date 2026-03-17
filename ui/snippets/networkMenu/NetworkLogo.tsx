import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  isCollapsed?: boolean;
  onClick?: (event: React.SyntheticEvent) => void;
  className?: string;
}

const LogoFallback = ({ isCollapsed, isSmall }: { isCollapsed?: boolean; isSmall?: boolean }) => {
  const display = isSmall ? {
    base: 'none',
    lg: isCollapsed === false ? 'none' : 'block',
    xl: isCollapsed ? 'block' : 'none',
  } : {
    base: 'block',
    lg: isCollapsed === false ? 'block' : 'none',
    xl: isCollapsed ? 'none' : 'block',
  };

  return (
    <IconSvg
      name={ isSmall ? 'networks/icon-placeholder' : 'networks/logo-placeholder' }
      width={ isSmall ? '60px' : '240px' }
      height="100%"
      color={{ base: 'blue.600', _dark: 'white' }}
      display={ display }
      aria-label={ isSmall ? 'Network icon placeholder' : 'Network logo placeholder' }
    />
  );
};

const INVERT_FILTER = 'brightness(0) invert(1)';

const NetworkLogo = ({ isCollapsed, onClick, className }: Props) => {

  const iconSrc = useColorModeValue(config.UI.navigation.icon.default, config.UI.navigation.icon.dark || config.UI.navigation.icon.default);

  return (
    <chakra.a
      className={ className }
      href={ route({ pathname: '/' }) }
      width="60px"
      height="60px"
      display="inline-flex"
      overflow="hidden"
      onClick={ onClick }
      flexShrink={ 0 }
      aria-label="Link to main page"
    >
      <Image
        w="100%"
        h="100%"
        src={ iconSrc }
        alt={ `${ config.chain.name } network icon` }
        fallback={ <LogoFallback isCollapsed={ isCollapsed } isSmall/> }
        filter={{ _dark: !config.UI.navigation.icon.dark ? INVERT_FILTER : undefined }}
        objectFit="contain"
        objectPosition="center"
      />
    </chakra.a>
  );
};

export default React.memo(chakra(NetworkLogo));
