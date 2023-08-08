import fetch from '../../utils/fetch'

export const getCount = () => fetch('/medicine/order/count/0')

export const getProductCount = () => fetch('/medicine/product/category')