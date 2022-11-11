import { MoralisStreamError, StreamErrorCode } from '@moralisweb3/core';
import { LogParser } from '../mapping/LogParser';
import { IWebhook } from '@moralisweb3/streams-typings';

export const hasAbis = (webhookData: IWebhook) => {
  if (!webhookData.abi || webhookData.abi.length < 1) {
    return false;
  }

  return true;
};

export const isWebhook = (webhookData: IWebhook) => {
  if (
    typeof webhookData !== 'object' ||
    webhookData === null ||
    !('logs' in webhookData)
  ) {
    return false;
  }

  return true;
};

export const parseLog = <Event>(webhookData: IWebhook) => {
  if (!isWebhook(webhookData)) {
    throw new MoralisStreamError({
      code: StreamErrorCode.GENERIC_STREAM_ERROR,
      message:
        'Cannot decode the logs. No logs found in the webhook, or invalid webhook provided.',
    });
  }

  if (!hasAbis(webhookData)) {
    throw new MoralisStreamError({
      code: StreamErrorCode.GENERIC_STREAM_ERROR,
      message: 'Cannot decode the logs. No abis found in the provided webhook.',
    });
  }

  const { logs, abi } = webhookData;

  const decodedLogs: Event[] = [];

  logs.forEach((currentLog) => {
    const { params } = new LogParser(abi).read(currentLog);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedLog: any = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const element = params[key];
        decodedLog[key] = element.value;
      }
    }
    decodedLogs.push(decodedLog as Event);
  });

  return decodedLogs;
};
