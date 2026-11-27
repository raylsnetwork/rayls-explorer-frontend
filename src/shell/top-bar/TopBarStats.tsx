// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import useStatsQuery from 'src/slices/chain/stats/useStatsQuery';
import GasInfoTooltip from 'src/slices/gas/components/GasInfoTooltip';
import GasPrice from 'src/slices/gas/components/GasPrice';
import discriminateDetailedPrices from 'src/slices/gas/utils/price';

import GetGasButton from 'src/features/get-gas-button/components/GetGasButton';

import config from 'src/config';
import dayjs from 'src/shared/date-and-time/dayjs';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

const TopBarStats = () => {
  const { data, isPlaceholderData, isError, refetch, dataUpdatedAt } = useStatsQuery();

  React.useEffect(() => {
    if (isPlaceholderData || !data?.gas_price_updated_at) {
      return;
    }

    const endDate = dayjs(dataUpdatedAt).add(data.gas_prices_update_in ?? 0, 'ms');
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

  const gasPrices = discriminateDetailedPrices(data?.gas_prices);
  const hasGasInfo = gasPrices !== undefined && config.features.gasTracker.isEnabled;

  return (
    <Flex
      alignItems="center"
      fontWeight={ 500 }
    >
      { hasGasInfo && (
        <>
          { data && (
            <Skeleton loading={ isPlaceholderData } whiteSpace="pre-wrap">
              <chakra.span color="text.secondary">Gas </chakra.span>
              <GasInfoTooltip data={ data } dataUpdatedAt={ dataUpdatedAt } placement="bottom-start">
                <Link>
                  <GasPrice data={ gasPrices.average ?? null }/>
                </Link>
              </GasInfoTooltip>
            </Skeleton>
          ) }
          { !isPlaceholderData && <GetGasButton/> }
        </>
      ) }
    </Flex>
  );
};

export default React.memo(TopBarStats);
