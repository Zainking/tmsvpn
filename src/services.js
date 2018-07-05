import request from './utils/request';

function objectToFormData(obj) {
  if (!obj) {
    return new URLSearchParams();
  }
  const result = new URLSearchParams();
  for (const key in obj) {
    if (obj[key].toString()) {
      result.set(key, obj[key].toString());
    }
  }
  return result;
}

export function queryList() {
  return request('https://api.tms.im/s/list');
}

export function signup({ username, password }) {
  return request('https://api.tms.im/s/create', {
    method: "POST",
    body: objectToFormData({
      name: username, password
    })
  });
}