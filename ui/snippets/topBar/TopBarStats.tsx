import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import dayjs from 'lib/date/dayjs';
import { HOMEPAGE_STATS } from 'stubs/stats';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import GasInfoTooltip from 'ui/shared/gas/GasInfoTooltip';
import GasPrice from 'ui/shared/gas/GasPrice';

import GetGasButton from './GetGasButton';

const TopBarStats = () => {
  const { data, isPlaceholderData, isError, refetch, dataUpdatedAt } = useApiQuery('general:stats', {
    queryOptions: {
      placeholderData: HOMEPAGE_STATS,
      refetchOnMount: false,
    },
  });

  React.useEffect(() => {
    if (isPlaceholderData || !data?.gas_price_updated_at) {
      return;
    }

    const endDate = dayjs(dataUpdatedAt).add(data.gas_prices_update_in, 'ms');
    const timeout = endDate.diff(dayjs(), 'ms');

    if (timeout <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      refetch();
    }, timeout);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [ isPlaceholderData, data?.gas_price_updated_at, dataUpdatedAt, data?.gas_prices_update_in, refetch ]);

  if (isError) {
    return <div/>;
  }

  const hasGasInfo = data?.gas_prices && data.gas_prices.average !== null && config.features.gasTracker.isEnabled;

  return (
    <Flex
      alignItems="center"
      fontWeight={ 500 }
    >
      { hasGasInfo && (
        <>
          <Skeleton loading={ isPlaceholderData } whiteSpace="pre-wrap">
            <chakra.span color="text.secondary">Gas </chakra.span>
            <GasInfoTooltip data={ data } dataUpdatedAt={ dataUpdatedAt } placement="bottom-start">
              <Link>
                <GasPrice data={ data.gas_prices?.average ?? null }/>
              </Link>
            </GasInfoTooltip>
          </Skeleton>
          { !isPlaceholderData && <GetGasButton/> }
        </>
      ) }
    </Flex>
  );
};

export default React.memo(TopBarStats);
