import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import { managerActions } from '../../store' // 作用
import { Input, Avatar, Tag, Table, Button, Space, Tooltip, Modal, Form, Upload, message } from 'antd';
import { EditOutlined, SearchOutlined, ExclamationCircleFilled, LoadingOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';
import style from './Manager.module.css'

function Manager() {
  const dispatch = useDispatch();
  const [ model, setModel ] = useState({ pagination: { current: 1, pageSize: 5 }, username: '', total: 0 })
  const { managerList, total, editList } = useSelector(state => state.manager);
  const [modal, modalHolder] = Modal.useModal()
  const [messageApi, messageHolder] = message.useMessage()

  const [open, setOpen] = useState(false)
  // 创建一个表单实例
  const [form] = Form.useForm()

  const formModel = useRef({
    id: { value: 0, rules: [] },
    username: { value: '', rules: [{ required: true, message: '请输入管理员账号' }] },
    nickname: { value: '', rules: [{ requried: true, message: '请输入管理员昵称' }] },
    avatar: { value: '', rules: [{ requried: true, message: '请输入管理员头像' }] }
  })
  useEffect(() => {
    // 同步表单数据和编辑数据
    formModel.current.id.value = editList.id;
    formModel.current.username.value = editList.username;
    formModel.current.nickname.value = editList.nickname;
    formModel.current.avatar.value = editList.avatar;
  },[editList])
  
  // useEffect(() => { setEditModel({...editList}) },[editList])
  // Table分页改变
  const fetchData = (pagination) => {
    const { current, pageSize } = pagination;
    setModel({ ...model, pagination: { ...model.pagination, current, pageSize } })
  }
  // 查询
  const fetchSearch = (search) => {
    setModel({...model, pagination: {...model.pagination, current: 1}, username: search})
  }
  useEffect(() => { setModel({ ...model, total }) }, [total])
  useEffect(() => { dispatch(managerActions.getList(model)) },  [model.pagination])

  const remove = (id) => {
    modal.confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '确定禁用吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch(managerActions.remove(id))
        setModel({...model, pagination: {...model.pagination, current: 1}})
        messageApi.open({
          type: 'success',
          content: '禁用成功！'
        })
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
        dispatch(managerActions.add(values));
      } else {
        // 调用dispatch方法，发送更新分类的action
        dispatch(managerActions.update(values));
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
    setOpen(false)
    // 重置表单数据
    form.resetFields();
  };
  const beginAdd = () => {
    setOpen(true);
    form.resetFields();
    // 设置表单初始值为一个空对象
    form.setFieldsValue({
      id: 0, username: '', nickname: '', password: '', avatar: '', status: 0
    })
    formModel.current.status = 0;
    formModel.current.avatar = '';
    console.log(formModel.current.avatar);
  }
  const beginUpdate = (id) => {
    const editModel = managerList.find(item => item.id === id);
    formModel.current = { ...editModel, createTime: '', updateTime: ''};
    // 同步表单数据和编辑数据
    // console.log(id);
    // console.log(managerList);
    // console.log('editModel' + editModel);
    // console.log('formModel.current' + JSON.stringify(formModel.current));
    // console.log(imageUrl);
    console.log(formModel.current.avatar);
    form.setFieldsValue(formModel.current);
    setOpen(true)
  };
  const beforeUpload = (file) => {
    // 图片格式限制
    const allowedExtensions = ['image/jpeg', 'image/png'];
    const isImage = allowedExtensions.includes(file.type);

    if (!isImage) {
      message.error('你只能上传JPG/PNG图片格式');
    }

    // 处理文件大小限制（可选）
    const fileSizeLimit = 5 * 1024 * 1024; // 5MB
    const isSizeValid = file.size <= fileSizeLimit;

    if (!isSizeValid) {
      message.error('图片必须小于5MB!');
    }

    return isImage && isSizeValid;
  };
  const [loading, setLoading] = useState(false);
  const uploadImage = (info) => {
    if(info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if(info.file.status === 'done') {
      setLoading(false);
      const values = form.getFieldValue();
      formModel.current = { ...values, avatar: info.file.response.data};
      form.setFieldsValue(formModel.current)
      console.log(values);
      console.log(formModel.current);
    }
  }
  // 搜索功能: filterDropdown, filterIcon, onFilter
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
    // 调用 fetchSearch 函数进行搜索
    fetchSearch(searchText); // 调用search
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // 清空搜索条件
    const searchText = '';
    fetchSearch(searchText);
  };
  const columns = [
    { title: '#', dataIndex: 'index', rowScope: 'row', width: '60px', align: 'center', render: (_, record, index) => model.pagination.pageSize * (model.pagination.current - 1) + index + 1 },
    { title: '账号', dataIndex: 'username', key: "id", width: '200px', align: 'center', ...getColumnSearchProps('username') },
    { title: '昵称', dataIndex: 'nickname', key: "id",  width: '200px', align: 'center' },
    { title: '头像', dataIndex: 'avatar', key: "id", width: '200px', align: 'center', render: (_, {avatar}) => (
      <Avatar size={50} shape='circle' src={`http://192.168.110.250:2709/medicine/${avatar}`}></Avatar>
    ) },
    { title: '状态', dataIndex: 'status', key: "id", width: '120px', align: 'center', render: (_, {status}) => (
      <>{status ? <Tag color="red">禁用</Tag> : <Tag color="cyan">正常</Tag>}</>
    ) },
    { title: '创建时间', dataIndex: 'createTime', key: "id", width: '200px', align: 'center' },
    { title: '更新时间', dataIndex: 'updateTime', key: "id", width: '200px', align: 'center' },
    { title: '操作', key: 'id', width: '200px', align: 'center', render: (record, {id}, ) => (
      <Space size='middle'>
        <Tooltip placement="top" title='编辑'>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => beginUpdate(id)} />
        </Tooltip>
        <Tooltip placement="top" title={record.status ? '已禁用' : '禁用'}>
          <Button type="primary" disabled={record.status} ghost danger icon={<StopOutlined />} onClick={() => remove(id)} />
        </Tooltip>
      </Space>
    )}
  ]
  const uploadButton = (
    <div>
      {/* loading切换加号 */}
      {loading? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const uploadRef = useRef(null);
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
        新增管理员
      </Button>
      <Table columns={columns} dataSource={managerList} rowKey='id' onChange={fetchData}
        pagination={{
          current: model.pagination.current, pageSize: model.pagination.pageSize, total: model.total,
          showSizeChanger: true, showQuickJumper: true,pageSizeOptions: ['5', '10', '15'], 
          showTotal: (total) =>`共${total}条`, position: ['bottomRight']
        }}
      />
      <Modal title="编辑用户" closeIcon={false} maskClosable={false} open={open} onOk={() => onOk(uploadRef)} onCancel={onCancel}>
        <Form form={form} initialValues={formModel.current}>
          <Form.Item label='账号' name="username" rules={[{required: true, message: '请输入管理员账号'}]}>
            {/*  disabled={editModel.id === 0 ? false : true} */}
            <Input placeholder='请输入管理员账号' type='text' disabled={formModel.current.status} /> 
          </Form.Item>
          <Form.Item label="昵称" name='nickname' rules={[{required: true, message: '请输入管理员昵称'}]} >
            <Input placeholder='请输入管理员昵称' type='text' />
          </Form.Item>
          <Form.Item  label="头像" className={style['avatar']} rules={[{ required: true, message: '请上传管理员头像' }]}>
            <Upload name="file"
              listType="picture-card" 
              showUploadList={false} 
              beforeUpload={beforeUpload} 
              onChange={uploadImage} 
              action='http://192.168.110.250:4002/medicine/api/file/upload' 
              ref={uploadRef}
            >
              {formModel.current.avatar ? (<img src={"http://192.168.110.250:2709/medicine/" + formModel.current.avatar} alt="avatar" style={{ width: '100%' , height: '100%'}}/>)  : (uploadButton)}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      {modalHolder}
      {messageHolder}
    </>
    
  )
}

export default Manager
