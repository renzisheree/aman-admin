/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TextArea from 'antd/es/input/TextArea';
import { ConsoleSqlOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import {toast} from 'react-toastify';
import Cookies from 'js-cookie'

interface DataType {
   _id: string;
   title: string;
   path: string;
   name: string;
   descriptions: string;
}

 
 
  const RoomType = () => {
     const [data, setData] = useState([]);
     const [open, setOpen] = useState(false);
     const [confirmLoading, setConfirmLoading] = useState(false);
     const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
     const [recordToDelete, setRecordToDelete] = useState(null);
     const access_token = Cookies.get('a_t');
    const [searchText, setSearchText] = useState('');
    const [isModalEditOpen, setIsModalEditOpen] = useState(false)
    const [recordToEdit, setRecordToEdit] = useState('');

//------------------------------------------------------
const formItemLayout = {
   labelCol: {
     xs: { span: 24 },
     sm: { span: 4 },
   },
   wrapperCol: {
     xs: { span: 24 },
     sm: { span: 20 },
   },
 };
 const formItemLayoutWithOutLabel = {
   wrapperCol: {
     xs: { span: 24, offset: 0 },
     sm: { span: 20, offset: 4 },
   },
 };
      //handle search bar
    const onSearch = (value) => {
      setSearchText(value);
    }
   let filteredData = data; 

if (searchText) {
   const searchTextLower = searchText.toLowerCase();
   filteredData = data.filter(item => {
     const nameLower = item.name.toLowerCase();
     return nameLower.includes(searchTextLower);
   });
}
const fetchRoomType = async () => {
   try {
      const response = await axios.get('http://20.2.232.155:3000/room-types/all')
      if(!response.data) {
         return {error: response.status}
      }
      setData(response.data?.items);
   } catch (error) {
      console.log(error);
   }
 }
 useEffect(() => {
   fetchRoomType()
 }, [])
//handle modal open when click button add Room
     const showModal = () => {
      setOpen(true);
    };
     const handleSubmit = async (values) => {
      try {
         const response = await axios.post('http://20.2.232.155:3000/room/room-types', values, {headers: {Authorization: `Bearer ${access_token}`}});
            toast.success(response.data.message);
            setOpen(false);
            setConfirmLoading(false);
            fetchRoomType()
            form.resetFields();
      } catch (error) {
         setConfirmLoading(false)
         toast.error('something Wrong');
         console.log(error)
      }
    };
    const handleCancel = () => {
      setOpen(false);
      form.resetFields();
    };
    //----------------------------------
     const columns: ColumnsType<DataType> = [
      {
         title: "ID",
         dataIndex: "_id",
         key: "id"
      },
      {
         title: "Title",
         dataIndex: "title",
         key: 'title'
      },
      {
         title: "Name",
         dataIndex: "name",
         key: 'name'
      },
      {
         title: "Description",
         dataIndex: "description",
         key: "description",
         ellipsis: true
      },
      {
         title: "Action",
         render: (text, record) => {
            return (
               <div>
                  <Button danger style={{marginRight: 10}} onClick={() => {
                     showModalDelete(record._id)
                  }} >Delete</Button>
                  <Button danger style={{color: "#c6c61b", borderColor: "#c6c61b"}} onClick={() => {
                     showModalEdit(record._id)
                  }}>Edit</Button>
               </div>
            )
         }
      }
    ]
const [form] = Form.useForm();
const showModalDelete = (id) => {
   setRecordToDelete(id);
   setIsModalDeleteOpen(true);
 };

 const handleOkDelete = () => {
   axios.delete(`http://20.2.232.155:3000/roomType/${recordToDelete}`, {headers: {Authorization: `Bearer ${access_token}`}}).then((res) => {
      toast.success(res.data.message);
      fetchRoomType();
   }).catch(e => toast.warn("Something wrong!"))
   setIsModalDeleteOpen(false);
 };

 const handleCancelDelete = () => {
   setIsModalDeleteOpen(false);
 };

 const handleOkEdit = (values) =>{
   axios.patch(`http://20.2.232.155:3000/roomType/${recordToEdit}`, values, {headers: {Authorization: `Bearer ${access_token}`}}).then(res => {
      toast.success(res.data.message);
      setIsModalEditOpen(false);
      fetchRoomType();
   }).catch(e => toast.error(e))
}
const handleCancelEdit = () => {
   setIsModalEditOpen(false);
}
const [formForEdit] = Form.useForm();
const showModalEdit = (id) => {
   setRecordToEdit(id);
 setIsModalEditOpen(true);
 axios.get(`http://20.2.232.155:3000/roomType/${id}`, {headers: {Authorization: `Bearer ${access_token}`}}).then(res => {
      const data = res.data.roomType;
      console.log(data)
      formForEdit.setFieldsValue({
         title: data.title,
         name: data.name,
         description: data.description,
         path: data.path,
         inclusion: data.inclusion
      });
   }).catch(e => console.log(e))
}


  return (
   
    <div>
      <div>
      <Modal title="Edit Room Type " open={isModalEditOpen} onOk={() => {
         formForEdit.submit();
      }} onCancel={handleCancelEdit}>
         <Form form={formForEdit} onFinish={handleOkEdit} layout='vertical'>
            <Form.Item label="Title" name={"title"}>
               <Input/>
            </Form.Item>
            <Form.Item label="Name" name={"name"}>
               <Input/>
            </Form.Item>
            <Form.Item label="Description" name={"description"}>
            <TextArea rows={4} />
            </Form.Item>
            <Form.Item label="Path" name={"path"}>
            <Input/>
            </Form.Item>
            <Form.List
        name= {"inclusion"}
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 2) {
                return Promise.reject(new Error('At least 2 inclusion'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...formItemLayout}
                label={index === 0 ? 'Inclusion' : ''}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input inclusion or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="inclusion" style={{ width: '60%' }} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
         </Form>
      </Modal> 
      <Modal title="Are you sure want to delete? " open={isModalDeleteOpen} onOk={handleOkDelete} onCancel={handleCancelDelete}></Modal>
      <Button type='primary' style={{margin: 10}} onClick={showModal}> Add Room Type</Button>
      <Search
      placeholder="input search text"
      allowClear
      enterButton="Search"
      size="large"
      onSearch={onSearch}
      style={{ width: 500, display: "block" }} 
    />
      </div>
      <Table columns={columns} dataSource={filteredData} />
      <Modal
       width="30%" closable={false}
        title=" Add Room Type"
        open={open}
        onOk={() => {
         form.submit()
        }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
      <Form form={form} onFinish={handleSubmit}
      layout='vertical'
      style={{ maxWidth: 600 }}
      >
         <Form.Item label="Title" name={"title"}>
            <Input/>
         </Form.Item>
         <Form.Item label="Name" name={"name"}>
            <Input/>
         </Form.Item>
         <Form.Item label="Description" name={"description"}>
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Path" name={"path"}>
            <Input/>
         </Form.Item>
         <Form.List
        name= {"inclusion"}
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 2) {
                return Promise.reject(new Error('At least 2 inclusion'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...formItemLayout}
                label={index === 0 ? 'Inclusion' : ''}
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input inclusion or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="inclusion" style={{ width: '60%' }} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
      </Form>
      </Modal>
    </div>
      );
};

export default RoomType;
