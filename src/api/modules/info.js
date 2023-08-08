import fetch from '../../utils/fetch'

// GET请求
// 分页查询所有产品
export const getList = ({pagination, name, production}) => fetch(`/medicine/product?page=${pagination.current}&pageSize=${pagination.pageSize}&name=${name}&production=${production}`)

export const getCategory = () => fetch('/medicine/category/list')

export const getInfo = (id) => fetch('/medicine/product/' + id)

export const add = (data) => fetch('/medicine/product', {
  headers: {'Content-Type': 'application/json'},
  method: 'post',
  body: JSON.stringify(data)
})

export const update = (data) => fetch('/medicine/product', {
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify(data),
  method: 'put'
})

export const remove = (id) => fetch(`/medicine/product?id=${id}`, {  method: 'delete' })