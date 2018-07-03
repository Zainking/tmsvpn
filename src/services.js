import request from './utils/request';

export function queryList() {
  return request('https://api.tms.im/s/list');
}
