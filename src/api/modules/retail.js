import fetch from '../../utils/fetch'

export const getList = ({pagination, code, name, status}) => fetch(`/medicine/order?page=${pagination.current}&pageSize=${pagination.pageSize}&name=${name}&status=${status}&code=${code}`)

export const changeStatus = ({id, status}) => fetch(`/medicine/order/${id}/${status}`, {method: 'put'})

export const getDetail = (id) => fetch('/medicine/order/detail/' + id)