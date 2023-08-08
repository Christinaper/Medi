import fetch from '../../utils/fetch'

export const getList = ({pagination, name}) => fetch(`/medicine/category?name=${name}&page=${pagination.current}&pageSize=${pagination.pageSize}`)

export const add = (data) => fetch('/medicine/category', {
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify(data),
  method: 'post'
})

export const getModel = (id) => fetch('/medicine/category/' + id)

export const update = (data) => fetch('/medicine/category', {
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify(data),
  method: 'put'
})

export const remove = (id) => fetch('/medicine/category/' + id , {method: 'delete'})