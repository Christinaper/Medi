import fetch from '../../utils/fetch'

// GET请求
export const getList = ({pagination, username}) => fetch(`/medicine/platformAdmin?page=${pagination.current}&pageSize=${pagination.pageSize}&username=${username}`)

export const getAdmin = (id) => fetch('/medicine/platformAdmin/' + id)

export const add = (data) => fetch('/medicine/platformAdmin', {
  headers: {'Content-Type': 'application/json'},
  method: 'post',
  body: JSON.stringify(data)
})

export const update = ({ id, nickname, avatar }) => fetch(`/medicine/platformAdmin?id=${id}&nickname=${nickname}&avatar=${avatar}`, {
  method: 'put'
})

export const remove = (id) => fetch(`/medicine/platformAdmin?id=${id}`, {
  method: 'delete'
})