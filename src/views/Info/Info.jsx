import { useEffect, useState, useRef } from 'react'
import ProjectUI from './InfotUI'
import { infoActions } from '../../store'
import { useDispatch, useSelector } from 'react-redux'
import { message, Modal, Button, Form } from 'antd'
import { ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';

function Info() {
  const dispatch = useDispatch()
  const [model, setModel] = useState({pagination: {current: 1, pageSize: 5}, name: '', production: '', total: 1})
  const {infoList, total, categoryList, editList} = useSelector(state => state.info)

  const fetchData = (pagination) => {
    const {current, pageSize} = pagination
    setModel({...model,pagination: {...model.pagination, current, pageSize}})
  }
  useEffect(() => {
    setModel({...model, total})
  }, [total])
  const fetchNameSearch = (search) => {
    setModel({...model, pagination: {...model.pagination, current: 1}, name: search})
    // console.log(infoList);
  }
  const fetchProductionSearch = (search) => {
    // console.log(233);
    setModel({...model, pagination: {...model.pagination, current: 1}, production: search})
    // console.log(infoList);
  }
  useEffect(() => {
    dispatch(infoActions.getList(model))
  }, [model.pagination])
  useEffect(() => {
    dispatch(infoActions.getCategory())
  }, [])

  //编辑
  const [modal, modalHolder] = Modal.useModal()
  const [messageApi, messageHolder] = message.useMessage()


  // 
  const [open, setOpen] = useState(false)
  // 创建一个表单实例
  const [form] = Form.useForm()
  const [editOther, setEditOther] = useState({ image: "", id: 0 });
  const formModel = useRef({
    id: { value: 0, rules: [] },
    name: { value: '', rules: [{ required: true, message: '请输入名称' }] },
    categories: { value: [], rules: [{ required: true, message: '请选择分类' }] }, // categories字段必须选择，否则显示错误信息
    dscp: { value: '', rules: [{ requried: true, message: '请输入描述' }] },
    price: { 
      value: 0, 
      rules: [
        { required: true, message: '请输入排序' },
        { type: 'number', min: 0, max: 100, message: '排序必须是0到100之间的数字' }
      ],
    },
    production: { value: '', rules: [{ requried: true, message: '请输入生产厂家' }] },
  })
  useEffect(() => {
    // 同步表单数据和编辑数据
    formModel.current.id.value = editList.id;
    formModel.current.name.value = editList.name;
    formModel.current.categories.value = editList.categories;
    formModel.current.dscp.value = editList.dscp;
    formModel.current.price.value = editList.price;
    formModel.current.production.value = editList.production;
  },[editList])


  //图片
  const [imageUrl, setImageUrl] = useState()
  const [loading, setLoading] = useState(false);
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
  const uploadImage = (info) => {
    if(info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if(info.file.status === 'done') {
      setLoading(false);
      setEditOther({ ...editOther, image: info.file.response.data });
      // const values = form.getFieldValue();
      // formModel.current = { ...values, image: info.file.response.data};
      // form.setFieldsValue(formModel.current)
      // console.log(values);
      console.log(formModel.current);
    }
  }
  const beginAdd = () => {
    setOpen(true)
    form.resetFields();
    setEditOther({ ...editOther, image: "", id: 0 });
    console.log(editOther);
    // 设置表单初始值为一个空对象
    // form.setFieldsValue({
    //   id: 0, name: '', categroies: [], dscp: '', price: '', production:'', status: 0, image: ''
    // })
    console.log(form.getFieldValue());
  }
  const beginUpdate = (id, record) => {
    const editList = infoList.find(item => item.id === id);
    const array = editList.categories.map(item => item.id.toString());
    formModel.current = {...editList, categories: array, createTime: '', updateTime: ''}
    // 同步表单数据和编辑数据
    form.setFieldsValue(formModel.current);
    setOpen(true)
    const image = `http://192.168.110.250:2709/medicine/${editList.image}`
    setImageUrl(image)
    setEditOther({ image: record.image, id: record.id });
    console.log(array);
    console.log(formModel.current);
    console.log(id, record);
    console.log('editOther:'+JSON.stringify(editOther));

  }
  const remove = (id) => {
    modal.confirm({
      title: '提示',
      icon: <ExclamationCircleFilled />,
      content: '确定删除吗?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch(infoActions.remove(id))
        setModel({...model, pagination: {...model.pagination, current: 1}})
        messageApi.open({
          type: 'success',
          content: '删除成功！'
        })
      },
      onCancel() {
        setEditOther({ ...editOther, image: "" });
        messageApi.open({
          type: 'success',
          content: '取消删除成功'
        })
      }
    })
  }
  const onOk = async () => {
    try {
      // 进行表单校验
      await form.validateFields();
      // 获取表单数据
      const values = form.getFieldValue();
      values.image = editOther.image;
      values.id = editOther.id;
      // 新增 or 修改
      if (values.id === 0) {
        // 调用dispatch方法，发送添加分类的action
        dispatch(infoActions.add(values));
      } else {
        // 调用dispatch方法，发送更新分类的action
        console.log(values);
        dispatch(infoActions.update(values));
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
    console.log(form.getFieldValue());
  }
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
        新增产品
      </Button>
      <ProjectUI form={form} editOther={editOther} infoList={infoList} categoryList={categoryList} model={model} tableChange={fetchData} searchName={fetchNameSearch} searchProduction={fetchProductionSearch} open={open} onCancel={onCancel} beginAdd={beginAdd} beginUpdate={beginUpdate} onOk={onOk} remove={remove} beforeUpload={beforeUpload} uploadImage={uploadImage} imageUrl={imageUrl} loading={loading}></ProjectUI>
      {modalHolder}
      {messageHolder}
    </>
  )
}

export default Info