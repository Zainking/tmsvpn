
import { queryList, signup, fetchCode, polling, open } from './services'
import { message } from 'antd';

const openOneBox = (box) => {
  switch (box.quality) {
    case 1: 
      message.success(`您的箱子品质为 垃圾箱 ，获得流量 ${box.flow}`)
      break
    case 2:
      message.success(`您的箱子品质为 废旧的箱子 ，获得流量 ${box.flow}`)
      break
    case 3:
      message.success(`您的箱子品质为 普通宝箱 ，获得流量 ${box.flow}`)
      break
    case 4:
      message.success(`您的箱子品质为 漂亮的箱子 ，获得流量 ${box.flow}`)
      break
    case 5:
      message.success(`您的箱子品质为 钻石宝箱！！ ，获得流量 ${box.flow}`)
      break
    case 6:
      message.success(`恭喜你！！！你开到了TMS背着老婆偷偷藏起来的宝♂藏！！！，获得流量 ${box.flow}`)
      break
    default:
  }
}

export default {

  namespace: 'users',

  state: {
    list: [],
    signup: {
      username: '',
      password: '',
      isRegisting: false
    },
    currentUser: {},
    pay: {
      cat: undefined,
      isGenerating: false,
      isPaying: false,
      pollingId: '',
      imgBase64: ''
    },
    openBox: {
      password: undefined,
      box: undefined,
      isOpening: false
    }
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {  // eslint-disable-line
      const list = yield call(queryList)
      const currentUser = yield select(state => state.users.currentUser)
      yield put({
        type: 'save',
        payload: list.data
      })
      if (currentUser.id) {
        yield put({
          type: 'refeshCurrentUser'
        })
      }
      return list.data
    },
    *submitRegist({ payload }, {call, put, select}) {
      const { username, password } = yield select(state => state.users.signup)
      yield put({ type: 'startReg'})
      const result = yield call(signup, { username, password })
      yield put({ type: 'finishReg', payload: result.data })

      return result.data.status
    },
    *generatePayCode({ payload }, { call, put, select }) {
      const { id } = yield select(state => state.users.currentUser)
      const { cat, pollingId } = yield select(state => state.users.pay)
      if (!cat) {
        message.error('请先选择套餐')
        return false
      }
      clearInterval(pollingId)
      yield put({ type: 'startGeneratePayCode' })
      const result = yield call(fetchCode, { id, cat })
      if (result.data.status === 1) {
        result.data.pollingId = setInterval(() => {
          polling(result.data.out_trade_no).then(function(res) {
            if (res.data.status === 1) {
              window.dispatch({ type: 'users/fetch' })
              window.dispatch({ type: 'users/finishPay' })
            }
          })
        }, 1000)
      }
      yield put({ type: 'finishGeneratePayCode', payload: result.data })
    },
    *openBox({ payload }, { call, put, select }) {
      const { id } = yield select(state => state.users.currentUser)
      const { password, box } = yield select(state => state.users.openBox)
      if (!password) {
        message.error('请输入密码')
        return false
      }
      if (!box) {
        message.error('请选择箱子数量')
        return false
      }
      yield put({ type: 'startOpen' })
      const result = yield call(open, {id, password, box})
      if (result.data.status === 1) {
        yield window.dispatch({ type: 'users/fetch' })
      }
      yield put({ type: 'finishOpen', payload: result.data })
    }
  },

  reducers: {
    save(state, action) {
      return { ...state, list: action.payload || [] };
    },
    saveRegInfo(state, action) {
      return { ...state, signup: { ...state.signup, ...action.payload } }
    },
    saveOpen(state, action) {
      const openBox = action.payload
      return { ...state, openBox: { ...state.openBox, ...openBox } }
    },
    startReg(state) {
      return { ...state, signup: { ...state.signup, isRegisting: true  }}
    },
    startGeneratePayCode(state) {
      return { ...state, pay: { ...state.pay, isGenerating: true } }
    },
    startOpen(state) {
      return { ...state, openBox: { ...state.openBox, isOpening: true } }
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
    },
    finishGeneratePayCode(state, action) {
      const { out_trade_no, qrcode, status, msg, pollingId } = action.payload
      if (status === 0) {
        message.error(msg)
        return { ...state, pay: { ...state.pay, isGenerating: false } }
      }
      if (status === 1) {
        return {
          ...state,
          pay: {
            isGenerating: false,
            tradeNo: out_trade_no,
            imgBase64: qrcode,
            isPaying: true,
            pollingId
          }
        }
      }
    },
    finishPay(state) {
      message.success('支付成功')
      clearInterval(state.pay.pollingId)
      return {
        ...state,
        pay: {
          ...state.pay,
          isPaying: false,
        }
      }
    },
    finishOpen(state, action) {
      const { status, msg } = action.payload
      switch (status) {
        case 0:
          message.error(msg)
          break
        case 1:
          msg.forEach(box => openOneBox(box))
          break
        case 2:
          message.warn(msg)
          break
        default:
      }
      return { ...state, openBox: { ...state.openBox, isOpening: false } }
    },
    closeOpen(state, action) {
      return { ...state, openBox: { ...state.openBox, password: undefined } }
    },
    closePay(state) {
      clearInterval(state.pay.pollingId)
      return {
        ...state,
        pay: {
          ...state.pay,
          isPaying: false,
        }
      }
    },
    setCurrentUser(state, action) {
      return { ...state, currentUser: action.payload }
    },
    changeCat(state, action) {
      return { ...state, pay: { ...state.pay, cat: action.payload } }
    },
    refeshCurrentUser(state) {
      return { ...state, currentUser: state.list.filter(user => user.id === state.currentUser.id)[0]}
    }
  },
};
