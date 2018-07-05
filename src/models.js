
import { queryList, signup } from './services'
import { message } from 'antd';
export default {

  namespace: 'users',

  state: {
    list: [],
    signup: {
      username: '',
      password: '',
      isRegisting: false
    }
  },

  effects: {
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      const list = yield call(queryList)
      yield put({
        type: 'save',
        payload: list.data
      });
    },
    *submitRegist({ payload }, {call, put, select}) {
      const { username, password } = yield select(state => state.users.signup)
      yield put({ type: 'startReg'})
      const result = yield call(signup, { username, password })
      yield put({ type: 'finishReg', payload: result.data })

      return result.data.status
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, list: action.payload || [] };
    },
    saveRegInfo(state, action) {
      return { ...state, signup: { ...state.signup, ...action.payload } }
    },
    startReg(state) {
      return { ...state, signup: { ...state.signup, isRegisting: true  }}
    },
    finishReg(state, action) {

      switch (action.payload.status) {
        case 1:
          message.success('注册成功')
          return { ...state, signup: { username: '', password: '', isRegisting: false } }
        case 0:
          message.error('注册失败')
          break;
        case 2:
          message.warn(`用户数量过多，当前限制用户数${action.payload.limit}`)
          break;
        default: message.info(action.payload.msg)
      }
      return { ...state, signup: { ...state.signup, isRegisting: false } }
    }
  },
};
