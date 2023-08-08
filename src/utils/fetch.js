import { message } from 'antd';
import fetch from 'isomorphic-fetch'
const baseUrl = "http://192.168.110.250:4002"

function myFetch(url, options) {//url 表示请求的相对路径，options 是一个包含请求配置的对象，比如请求方法、请求头等
  return fetch(baseUrl + url, options)
    .then(res => {
      if(res.status === 200 || res.status === 304) {
        console.log(res)
        return res.json();//如果状态码为 200 或 304，表示请求成功，读取响应的 JSON 数据并返回
      } else throw new Error(res.statusText);//抛出一个包含错误状态文本的 Error 对象
    })
    .then(res => {
      switch(res.code) {//如果 res.code 为 0，表示请求成功，返回响应的数据 (res.data)；如果 res.code 是其他特定值，可能表示请求失败或出现其他错误，抛出一个包含错误信息的 Error 对象
        case 0: return res.data;
        // case 1: throw message.error(res.msg);
        case 199:
        case 404:
        case 401:
        case 500:
        default: 
          throw message.error(res.msg);
      }
    })
    .catch(e => {//在任何一个步骤中出现异常，将会进入 .catch 方法。这里会打印出错误信息，并使用 Promise.reject 返回一个被拒绝的 Promise，以便在调用该函数的地方进行错误处理
      console.log(e.message);
      return Promise.reject(e.message);
    });
}

export default myFetch;
