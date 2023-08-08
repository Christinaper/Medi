import * as echarts from 'echarts'
import style from './HomePage.module.css'
import { MoneyCollectOutlined, ReconciliationOutlined, RestOutlined, SendOutlined } from '@ant-design/icons';
import { Col, Row, Statistic } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import { homepageActions } from '../../store'

function HomePage() {
  const dispatch = useDispatch()
  const order = useSelector(state => state.homepage.order);
  const categoryList = useSelector(state => state.homepage.categoryList);
  const chartRef = useRef(null)
  useEffect(() => {
    dispatch(homepageActions.getCount())
    dispatch(homepageActions.getProductCount())
  const data = categoryList.map((item) => {
    return {
      value: item['count'],
      name: item['category']
    }
  })
  console.log(data)
  // Echarts
  let chartInstance = echarts.init(chartRef.current);
    const option = {
      title: {
        text: '各分类商品数量',
        left: 'center',
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: '50%',
          data: [...data],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    chartInstance.setOption(option);
  }, [])

  return(
    <div className={style['container']}>
      <h1 className={style['order-title']}>各状态订单情况</h1>
      <Row className={style['order-main']}>
        <Col span={6}>
          <Statistic title="待付款" value={order.minusOneCount} prefix={<MoneyCollectOutlined />} />
        </Col>
        <Col span={6}>
          <Statistic title="待发货" value={order.zeroCount} prefix={<SendOutlined />} />
        </Col>
        <Col span={6}>
          <Statistic title="待收货" value={order.oneCount} prefix={<ReconciliationOutlined />} />
        </Col>
        <Col span={6}>
          <Statistic title="退货/退换" value={order.threeCount} prefix={<RestOutlined />} />
        </Col>
      </Row>
      <div className={style['charts']}>
        <div ref={chartRef} className={style['charts-content']}></div>
      </div>
    </div>
  )
}

export default HomePage