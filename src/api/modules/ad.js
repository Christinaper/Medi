import fetch from '../../utils/fetch'

export const getCarousel = () => fetch('/medicine/carousel')

export const saveCarousel = (data) => fetch('/medicine/carousel', {
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify(data),
  method: 'put'
})

export const getProductList = () => fetch(`/medicine/product/list?dscp=&name=`)
export const getCategoryList = () => fetch('/medicine/category/list')

export const getRecommend = () => fetch('/medicine/recommend')
export const saveRecommend = (data) => fetch('/medicine/recommend', {
  headers: {'Content-Type': 'application/json'},
  body:JSON.stringify(data),
  method: 'put'
})