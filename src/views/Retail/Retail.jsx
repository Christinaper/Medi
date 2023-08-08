import { retailActions } from '../../store';
import { useDispatch, useSelector } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons'
import { message, Input, Button, Table, Tag, Space, Drawer, Card } from 'antd';
import { useState, useEffect } from 'react';
import style from './Retail.module.css'

function Retail() {
  const dispatch = useDispatch()
  const [model, setModel] = useState({pagination: {current: 1, pageSize: 5}, name: '', status: '', code: 0})
  const {getRetailList, total, detailList} = useSelector(state => state.retail)

  // const fetchData = (pagination) => {
  //   console.log(111);
  //   const {current, pageSize} = pagination
  //   setModel({...model, pagination: {...model.pagination, current, pageSize}})
  // }
  const fetchData = (pagination, status) => {
    console.log(status);
    if (status?.id?.[0] === '') { // 初始化的分页
      // 检查status.id[0]是否为空字符串 
      status.id[0] = null; // 将其设置为null 
    } 
    const idValue = status === '' ? '' : status?.id?.[0] ?? ''; // 使用空值合并运算符
    // 获取数组 id 的第一个元素，如果status为空字符串，则设置为空字符串；如果status不存在或id为空，则设置为''
    // const idValue = status === '' ? '' : status?.id?.[0] ?? ''; 

    console.log(idValue);
    const {current, pageSize} = pagination
    setModel({...model, pagination: {...model.pagination, current, pageSize}, status: idValue})
  }
  useEffect(() => {
    setModel({...model, total})
  }, [total])

  const retailSearch = (search) => {
    setModel({...model, pagination: {...model.pagination, current: 1}, name: search})
  }
  useEffect(() => {
    dispatch(retailActions.getList(model))
  }, [model.pagination, model.status])

  //编辑
  const [open, setOpen] = useState(false)

  const onCancel = () => {
    setOpen(false)
  };
  const filter = [
    {value: '', text: '全部'},
    {value: -1, text: '待付款'},
    {value: 0, text: '待发货'},
    {value: 1, text: '待收货'},
    {value: 2, text: '已收货'}
  ]
  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case -1:
        return 'gold';
      case 0:
        return 'cyan';
      case 1:
        return 'blue';
      case 2:
        return 'green';
      default:
        return 'default';
    }
  }
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={'搜索收货人'}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            搜索
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            重置
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    // onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  })
  const handleSearch = (selectedKeys, confirm) => {
    // console.log(model);
    // console.log(selectedKeys, selectedKeys[0]);
    confirm();
    const searchText = selectedKeys[0] ? selectedKeys[0] : ''; // 避免传入undefined
    // 调用 search 函数进行搜索
    retailSearch(searchText); // 调用search
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // 清空搜索条件
    const searchText = '';
    retailSearch(searchText);
  };
  //获取详情(抽屉)
  const getDetail = (id) => {
    // console.log(getRetailList);
    // console.log(total);
    console.log(detailList);
    setOpen(true)
    dispatch(retailActions.getDetail(id))
  }
  //更改状态
  const [messageApi, messageHolder] = message.useMessage()
  const changeStatus = (item) => {
    dispatch(retailActions.changeStatus(item))
    messageApi.open({
      type: 'success',
      content: '发货成功'
    })
    setModel({...model, pagination: {...model.pagination, current: model.pagination.current}})
  }

  const columns = [
    { title: '#', dataIndex: 'index', rowScope: 'row', width: '60px', align: 'center', render: (_, record, index) => model.pagination.pageSize * (model.pagination.current - 1) + index + 1 },
    {title: '订单号', dataIndex: 'number', width: '200px', align: 'center', key: 'id'},
    {title: '收货人', dataIndex: 'address', width: '150px',align: 'center', key: 'id', ...getColumnSearchProps('address.receiverName'), render: (_, {address}) => (
      <div>{address ? address.receiverName : '我不到啊'}</div>
    ) },
    {title: '金额', dataIndex: 'amount', width: '300px', align: 'center', key: 'id'},
    {title: '状态', dataIndex: 'status', width: '150px',align: 'center', key: 'id',
      filters: filter,
      filterMultiple: false,
      onFilter: (value, record) => record.status === value, // value是筛选项的值, record是当前行的数据; onFilter返回布尔值, 用于判断是否要显示当前行的数据
      render: (text, record) => {
        const statusItem = filter.find((item) => item.value === record.status)
        return (<Tag color={statusItem ? getStatusColor(record.status) : 'default'}>{statusItem ? statusItem.text : '-'}</Tag>)
      }
    },
    {title: '下单时间', dataIndex: 'createTime', width: '300px', align: 'center', key: 'id'},
    {title: '操作', key: 'id', dataIndex: 'status', render: (status, {id}) => (
      <Space>
        <Button type="primary" onClick={() => getDetail(id)}>详情</Button>
        <Space>
          {(() => {
            switch(status) {
              case -1:
                return
              case 0:
                return <Button onClick={() => changeStatus({id, status: 1})}>发货</Button>
              default:
                return <Button disabled>已发货</Button>
            }
          })()}
        </Space>
    </Space>
    )}
  ]
  return(
    <>
      {messageHolder}
      <div className={style['category-container']}>
        <div className={style['category-search']}>
          <Button
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            <a
              href="http://192.168.110.250:4002/medicine/file/exportOrderExcel"
              download="订单列表"
            >
              导出订单
            </a>
          </Button>
            
          {/* <Search placeholder='请输入分类名称' allowClear enterButton='查询' style={{width: 250}} onSearch={categorySearch} className={style['search-input']} size="large" /> */}
        </div>
        <Table columns={columns} dataSource={getRetailList} rowKey='id' onChange={fetchData}
          pagination={{
            current: model.pagination.current,
            pageSize: model.pagination.pageSize,
            total: model.total, 
            showSizeChanger: true, 
            showQuickJumper: true, 
            pageSizeOptions: ['5', '10', '15'], showTotal: (total) =>`共${total}条`, 
            position: ['bottomRight']
          }}
        ></Table>
      </div>
      <Drawer title='订单详情' placement='right' onClose={onCancel} open={open} maskClosable={false} keyboard={false} width={520} >
        {detailList.map((item) => (
          <Card title={item.productName} style={{width: 450}} key={item.id} className={style['card']} hoverable>
          <div className={style['product-content']}>
            <span className={style['product-title']}>产品数量：</span>
            <span className={style['pro-content']}>{item.productCount}</span>
          </div>
          <div className={style['product-content']}>
            <span className={style['product-title']}>产品描述：</span>
            <span className={style['pro-content']}>{item.productDesc}</span>
          </div>
          <div className={style['product-content']}>
            <span className={style['product-title']}>生产场地：</span>
            <span className={style['pro-content']}>{item.productProduction}</span>
          </div>
          <img src={`http://192.168.110.250:2709/medicine/${item.productImage}`} className={style['product-image']} />
        </Card>
        ))}
      </Drawer>
    </>
  )
}

export default Retail