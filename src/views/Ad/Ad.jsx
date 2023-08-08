import { useEffect, useState } from "react"
import { adActions } from '../../store';
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, Button, Select, Space, message } from 'antd';
// import { useState, useEffect } from 'react';
// import style from './Ad.module.css'

function Ad() {
  const dispatch = useDispatch() // 向store派发action
  // 渲染: 首页轮播图 + 商品分类列表 + 商品列表 + 首页推荐 
  const {carousel, productList, recommend, categoryList} = useSelector(state => state.ad);
  useEffect(() => {
    dispatch(adActions.getCarousel())
    dispatch(adActions.getCategoryList())
    dispatch(adActions.getProductList())
    dispatch(adActions.getRecommend())
  },[])

  // 轮播图的onChange事件
  const [carlArr, setCarlArr] = useState([])
  const changeCarl = (productId, productImage, carlId) => {
    // console.log(111);
    // console.log(productId, productImage, carlId);
    // console.log(carlArr);
    setCarlArr(carlArr.map(item => item.id === carlId ? { ...item, productId, productImage } : item)) // 修改productId, productImage
  }
  useEffect(() => {
    setCarlArr(carousel) // 将carousel中的数据赋值给carlArr状态变量
  }, [carousel])

  // Title
  const [recommendArr, setRecommendArr] = useState([])
  const changeTitle = (categoryName, recommendId) => { // item.categoryName, item.id
    setRecommendArr(recommendArr.map(item => 
      item.id === recommendId ? {...item, categoryName} : item // 修改categoryName, 也就是卡片value
    ))
  } 
  useEffect(() => {
    setRecommendArr(recommend) // 讲recommend中的数据赋值给recommendArr状态变量
  }, [recommend])

  // change推荐
  const changeRecommend = (productId, productImage, recommendInfoId) =>
    setRecommendArr( // 更新recommendArr
      recommendArr.map(item => ({
        ...item,
        recommendInfos: item.recommendInfos.map(item2 => ({
          ...item2,
          ...(item2.id === recommendInfoId && { productId, productImage })
          // 使用展开运算符和逻辑与运算符来实现条件更新。
          // 如果原对象的id等于recommendInfoId，则返回一个新对象，将productId和productImage属性更新为传入的参数值；
          // 否则返回undefined。展开运算符会忽略undefined值，所以不会影响原对象。
        }))
      }))
  );

  // save
  const [messageApi, messageHolder] = message.useMessage()
  const saveCarousel = () => {
    dispatch(adActions.saveCarousel(carlArr))
    messageApi.open({
      type: 'success',
      content: '保存成功！'
    })
  }
  const saveRecommend = () => {
    dispatch(adActions.saveRecommend(recommendArr))
    messageApi.open({
      type: 'success',
      content: '保存成功！'
    })
  }

  return(
    <>
      {messageHolder}
      <Card
        title="首页轮播设置"
        extra={<Button type='primary' onClick={saveCarousel}>保存</Button>}
      >
        <Row gutter={16}>
          {carlArr.map((item) => (
            <Col span={6} key={item.id}>
              <Card key={item.id}
                title={
                  <Select value={item.productId} defaultValue={item.productId} onChange={(value, option) => changeCarl(value, option.image, item.id)} style={{width: '220px'}}>
                    {productList.map((item) => (
                      <Select.Option key={item.id} value={item.id} {...item}>{item.name}</Select.Option>
                      // 将商品信息传递给onChange函数中的option参数，方便获取商品图片等信息。
                      // 如果删掉{...item}，那么option参数就只会包含value属性，而无法获取其他属性。
                  ))}
                  </Select>
                }>
                <img src={`http://192.168.110.250:2709/medicine/${item.productImage}`} alt="" style={{ width: '100%', height: '200px' }} />
              </Card>
            </Col>
            
            ))}
        </Row>
      </Card>
      <Card
        title="首页推荐设置"
        extra={<Button type='primary' onClick={saveRecommend}>保存</Button>}
      >
        <Row gutter={16}>
          {recommendArr.map((item) => (
            <Col span={6} key={item.id} style={{ margin: '16px 0' }}>
              <Card key={item.id}
                type="inner"
                title={
                  <Select value={item.categoryName} defaultValue={item.categoryName} onChange={(value) => changeTitle(value, item.id)} style={{width: '220px'}}>
                    {categoryList.map((item) => (
                      <Select.Option key={item.id} value={item.id} {...item}>{item.name}</Select.Option>
                  ))}
                  </Select>
                }>
                  <Space direction="vertical">
                    {item.recommendInfos.map((item) => (
                      <Select key={item.id} value={item.productId} defaultValue={item.productId} onChange={(value, option) => changeRecommend(value, option.image, item.id, item.recommendId)} style={{width: '220px'}}>
                        {productList.map((item) => (
                          <Select.Option key={item.id} value={item.id} {...item}>{item.name}</Select.Option>
                        ))}
                      </Select>
                    ))}
                  </Space>
                  
              </Card>
            </Col>
            ))}
        </Row>
      </Card>
    </>
  )
}

export default Ad

/**
 * Card + 选择器
 * 渲染: const {carousel, productList, recommend, categoryList} = useSelector(state => state.ad)
 * onChange事件: 3个Select标签，三个onChange事件
 * save
 */