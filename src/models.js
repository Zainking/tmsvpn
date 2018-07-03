
import { queryList } from './services'
export default {

  namespace: 'users',

  state: {
    list: []
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      const list = yield call(queryList)
      yield put({
        type: 'save',
        payload: list.data
      });
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, list: action.payload };
    },
  },

};
