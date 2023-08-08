import { categoryActions } from '../../store';
import { useDispatch, useSelector } from 'react-redux'
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { message, Input, Button, Table, Space, Modal, Form, InputNumber, Tooltip } from 'antd';
import { useState, useEffect, useRef } from 'react';

function Category() {
  const dispatch = useDispatch()
  const [model, setModel] = useState({pagination: {current: 1, pageSize: 5}, total: 0, name: ''})
  const {getCategoryList, total, editList} = useSelector(state => state.category)

  // Table分页改变
  const fetchData = (pagination) => {
    const {current, pageSize} = pagination
    setModel({...model, pagination: {...model.pagination, current, pageSize}})
  }
  // 查询
  const categorySearch = (search) => {
    setModel({...model, pagination: {...model.pagination, current: 1}, name: search})
  }
  useEffect(() => {
    setModel({...model, total})
  }, [total])
  useEffect(() => {
    dispatch(categoryActions.getList(model))
  }, [model.pagination])

  const [open, setOpen] = useState(false)
  // 创建一个表单实例
  const [form] = Form.useForm()

  const formModel = useRef({
    id: { value: 0, rules: [] },
    name: { value: '', rules: [{ required: true, message: '请输入分类名称' }] },
    slogan: { value: '', rules: [{ requried: true, message: '请输入分类' }] },
    sort: { 
      value: 0, 
      rules: [
        { required: true, message: '请输入排序' },
        { type: 'number', min: 0, max: 100, message: '排序必须是0到100之间的数字' }
      ],
    },
  })
  useEffect(() => {
    // 同步表单数据和编辑数据
    formModel.current.id.value = editList.id;
    formModel.current.name.value = editList.name;
    formModel.current.slogan.value = editList.slogan;
    formModel.current.sort.value = editList.sort;
  },[editList])
  // 新增
  const beginAdd = () => {
    setOpen(true);
    form.resetFields();
    // 设置表单初始值为一个空对象
    form.setFieldsValue({ id: 0, name: '', slogan: '', sort: 0 });
    // 清空搜索条件
    categorySearch('');
  }
  // 更新
  const beginUpdate = (id) => {
    const editModel = getCategoryList.find(item => item.id === id);
    formModel.current = { ...editModel, createTime: '', updateTime: '' };
    // 同步表单数据和编辑数据
    console.log(getCategoryList);
    console.log(editModel);
    form.setFieldsValue(formModel.current);
    setOpen(true);
  };

  // 搜索 + 筛选
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`搜索 ${dataIndex}`}
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
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  })
  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    const searchText = selectedKeys[0] ? selectedKeys[0] : ''; // 避免传入undefined
    // 调用 search 函数进行搜索
    categorySearch(searchText); // 调用search
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // 清空搜索条件
    const searchText = '';
    categorySearch(searchText);
  };
  // 删除
  const remove = (id) => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '确定删除吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch(categoryActions.remove(id))
        setModel({...model, pagination: {...model.pagination, current: 1}})
        message.success('删除成功！');
      },
      onCancel() {}
    })
  }


  const onOk = async () => {
    try {
      // 进行表单校验
      await form.validateFields();
      // 获取表单数据
      const values = form.getFieldValue();
      // 新增 or 修改
      if (values.id === 0) {
        // 调用dispatch方法，发送添加分类的action
        dispatch(categoryActions.add(values));
      } else {
        // 调用dispatch方法，发送更新分类的action
        dispatch(categoryActions.update(values));
      }
      // 重置当前页为第一页
      setModel({ ...model, pagination: { ...model.pagination, current: 1 } });
      // 关闭弹窗
      setOpen(false);
      // 显示成功提示信息
      message.success('编辑成功！');
    } catch (error) {
      // 如果校验失败，显示错误信息
      console.log(error);
    }
  }
  const onCancel = () => {
    // 关闭弹窗
    setOpen(false);
    // 重置表单数据
    form.resetFields();
  };
  const columns = [
    { title: '#', dataIndex: 'index', rowScope: 'row', width: '60px', align: 'center', render: (_, record, index) => model.pagination.pageSize * (model.pagination.current - 1) + index + 1 },
    {title: '分类名称', dataIndex: 'name', width: '200px', align: 'center', key: 'id', ...getColumnSearchProps('name')},
    {title: '分类描述', dataIndex: 'slogan', width: '220px', align: 'center', key: 'id'},
    {title: '排序', dataIndex: 'sort', width: '200px', align: 'center', key: 'id'},
    {title: '创建时间', dataIndex: 'createTime', width: '300px', align: 'center', key: 'id'},
    {title: '更新时间', dataIndex: 'updateTime', width: '300px', align: 'center', key: 'id'},
    {title: '操作', key: 'id', render: (_, {id}) => (
      <Space>
        <Tooltip placement="top" title='编辑'>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => beginUpdate(id)} />
        </Tooltip>
        <Tooltip placement="top" title='删除'>
          <Button type="primary" ghost danger icon={<DeleteOutlined />} onClick={() => remove(id)} />
        </Tooltip>
      </Space>
    )}
  ]
  return(
    <>
      <Button
        onClick={beginAdd}
        icon={<PlusOutlined />}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        新增分类
      </Button>
      <Table columns={columns} dataSource={getCategoryList} rowKey='id' onChange={fetchData}
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
      {/* 在Modal中添加onOk和onCancel属性，并绑定相应的函数 */}
      <Modal title='编辑分类' closeIcon={false} maskClosable={false} open={open} onOk={onOk} onCancel={onCancel}>
        <Form form={form} initialValues={formModel.current}>
          <Form.Item label='分类名称' name='name' rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder='请输入分类名称' />
          </Form.Item>
          <Form.Item label='分类描述' name='slogan' rules={[{ required: true, message: '请输入分类描述' }, { max: 50, message: '分类描述不能超过50个字符' }]}>
            <Input placeholder='请输入分类描述' />
          </Form.Item>
          <Form.Item label='排序' name='sort' rules={[{ required: true, message: '请输入排序' }]}>
            <InputNumber placeholder='请输入排序' />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Category

/**
 * 表单验证
 * Form + Form.Item
 * 给Form.Item加 rules, required
 */