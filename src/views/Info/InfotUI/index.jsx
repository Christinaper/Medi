import style from './index.module.css'
import { EditOutlined, DeleteOutlined, PlusOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Button, Image, Table, Tag, Space, Modal, Form, Upload, Select, Tooltip  } from 'antd';
import { useRef } from 'react';
import PropTypes from 'prop-types'; // 用prop-types库对props进行类型验证

InfoUI.propTypes = {
  infoList: PropTypes.array.isRequired,       // 数组类型
  model: PropTypes.object.isRequired,            // 对象类型
  tableChange: PropTypes.func.isRequired,        // 函数类型
  categoryList: PropTypes.object.isRequired,     // 对象类型
  open: PropTypes.func.isRequired,               // 函数类型
  onCancel: PropTypes.func.isRequired,           // 函数类型
};

function InfoUI ({form, editOther, infoList, model, tableChange, searchName, searchProduction, categoryList, open, onCancel, beginAdd, beginUpdate, onOk, remove, beforeUpload, uploadImage, imageUrl, loading }) {
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
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
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
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    console.log(dataIndex);
    console.log(selectedKeys[0]);
    const searchText = selectedKeys[0] ? selectedKeys[0] : ''; // 避免传入undefined
    if(dataIndex === 'production') searchProduction(searchText); // 调用search
    else searchName(searchText); 
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    // 清空搜索条件
    const searchText = '';
    searchName(searchText);
    searchProduction(searchText)
  };
  const columns = [
    { title: '#', dataIndex: 'index', rowScope: 'row', width: '60px', align: 'center', render: (_, record, index) => model.pagination.pageSize * (model.pagination.current - 1) + index + 1 },
    {title: '产品名称', dataIndex: 'name', width: '150px', align: 'center', key: "id", ...getColumnSearchProps('name')},
    {title: '产品图片', dataIndex: 'image', width: '150px', align: 'center', key: "id", render: (_, {image}) => (
      <Image width={90} shape='square' src={`http://192.168.110.250:2709/medicine/${image}`} visible='false'></Image>
    )},
    {title: '产品分类', dataIndex: 'categories', width: '150px', align: 'center' ,key: 'id', render: (_, {categories}) => (
      <>{categories.map(item => (<Tag key={item.id} color='cyan'>{item.name}</Tag>))}</>
    )},
    {title: '产品描述', dataIndex: 'dscp', key: 'id', width: '300px', align: 'center'},
    {title: '产品价格', dataIndex: 'price', key: 'id', width: '200px', align: 'center'},
    {title: '生产厂家', dataIndex: 'production', key: 'id', width: '300px', align: 'center', ...getColumnSearchProps('production')},
    {title: '操作', key: 'id', render: (record, {id}) => (
      <Space>
        <Tooltip placement="top" title='编辑'>
          <Button type="primary" ghost icon={<EditOutlined />} onClick={() => beginUpdate(id, record)} />
        </Tooltip>
        <Tooltip placement="top" title='删除'>
          <Button type="primary" ghost danger icon={<DeleteOutlined />} onClick={() => remove(id)} />
        </Tooltip>
      </Space>
    )}
  ]
  const uploadButton = (
    <div>
      {loading? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const uploadRef = useRef(null)
  return (
    <div className={style['info-container']}>
        <Table columns={columns} dataSource={infoList} rowKey='id' onChange={tableChange} className={style['table']}
          pagination={{
            current: model.pagination.current,
            pageSize: model.pagination.pageSize,
            total: model.total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['5', '10', '15'],
            showTotal: (total) =>`共${total}条`,
            position: ['bottomRight']
          }} 
        />
      <Modal title='编辑产品' closeIcon={false} maskClosable={false} open={open} onOk={onOk} onCancel={onCancel}>
        <Form form={form}>
          <Form.Item label="产品名称" name="name" rules={[{required: true, message: '请输入产品名称'}]}>
            <Input placeholder='请输入产品名称' name='name' />
          </Form.Item>
          <Form.Item label="产品分类" name="categories" rules={[{required: true, message: '请选择产品分类'}]}>
            <Select mode='tags' showArrow placeholder="请选择分类标签">
              {categoryList.map((item) => (
                <Select.Option key={item.id} label={item.name}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="产品描述" name="dscp" rules={[{required: true, message: '请输入产品描述'}]}>
            <Input placeholder='请输入产品描述' />
          </Form.Item>
          <Form.Item label="产品价格" name="price" rules={[{required: true, message: '请输入产品价格'}]}>
            <Input placeholder='请输入产品价格' />
          </Form.Item>
          <Form.Item label="生产厂家" name='production' rules={[{required: true, message: '请输入生产厂家'}]}>
            <Input placeholder='请输入生产厂家' />
          </Form.Item>
          <Form.Item label="图片" className={style['avatar']}>
            <Upload name="file" className={style['upload-avatar']} listType="picture-card" showUploadList={false} beforeUpload={beforeUpload} onChange={uploadImage} action='http://192.168.110.250:4002/medicine/api/file/upload' ref={uploadRef}>
            {/* {imageUrl ? (<img src={imageUrl} alt="image" style={{ width: '100%' , height: '100%'}}/>)  : (uploadButton)} */}
            {/* {initialValues.image ? (<img src={"http://192.168.110.250:2709/medicine/" + initialValues.image} alt="avatar" style={{ width: '100%' , height: '100%'}}/>)  : (uploadButton)} */}
            {editOther.image ? (<img src={"http://192.168.110.250:2709/medicine/" + editOther.image} alt="avatar" style={{ width: '100%' , height: '100%'}}/>)  : (uploadButton)}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default InfoUI