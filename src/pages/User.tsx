import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Form, Input, Modal, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TextArea from 'antd/es/input/TextArea';
import {  MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import {toast} from 'react-toastify';
import Cookies from 'js-cookie'
 const User = () => {
   const [data, setData] = useState([]);
   const [open, setOpen] = useState(false);
   const [confirmLoading, setConfirmLoading] = useState(false);
   const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
   const [recordToDelete, setRecordToDelete] = useState(null);
   const [recordToEdit, setRecordToEdit] = useState(null);
   const [isModalEditOpen, setIsModalEditOpen] = useState(false)

   const access_token = Cookies.get('a_t');
  const [roomTypes, setRoomTypes] = useState([]);
  const [searchText, setSearchText] = useState('');
//------------------------------------------------------
const [formForEdit] = Form.useForm();
    //handle search bar
  const onSearch = (value) => {
    setSearchText(value);
  }
 let filteredData = data; 

if (searchText) {
 const searchTextLower = searchText.toLowerCase();
 filteredData = data.filter(item => {
   const lastNameLower = item?.lastname.toLowerCase();
   const phone = item?.phone;
   const email = item?.email.toLowerCase();
   const role = item?.role.toLowerCase();
   return (
      lastNameLower.includes(searchTextLower) ||
      phone.includes(searchTextLower) ||
      email.includes(searchTextLower) ||
      role.includes(searchTextLower)
    );
 });
}
const fetchUser = async () => {
 try {
    const response = await axios.get('http://localhost:3000/auth/users', {headers: {Authorization: `Bearer ${access_token}`}})
    if(!response.data) {
       return {error: response.status}
    }
    setData(response.data?.data?.items);
 } catch (error) {
    console.log(error);
 }
}
useEffect(() => {
 fetchUser()
}, [])
//handle modal open when click button add user
   const showModal = () => {
    setOpen(true);
  };
   const handleSubmit = async (values) => {
      console.log(values)
    try {
       const response = await axios.post('http://localhost:3000/users', values, {headers: {Authorization: `Bearer ${access_token}`}});
          toast.success(response.data.message);
          setOpen(false);
          setConfirmLoading(false);
          fetchUser()
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
  const showModalEdit = (id) => {
   setRecordToEdit(id);
   setIsModalEditOpen(true)
   axios.get(`http://localhost:3000/user/${id}`, {headers: {Authorization: `Bearer ${access_token}`}}).then(res => {
      const data = res.data.user;
      console.log(data)
      formForEdit.setFieldsValue({
         firstname: data.firstname,
         lastname: data.lastname,
         phone: data.phone,
         country: data.country,
         email: data.email,
         role: data.role,
      });
   }).catch(e => console.log(e))
  }
   const columns: ColumnsType = [
    {
       title: "ID",
       dataIndex: "_id",
       key: "id"
    },
    {
       title: "First Name",
       dataIndex: "firstname",
       key: 'firstname'
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: 'lastname'
   },
   {
      title: "Phone",
      dataIndex: "phone",
      key: 'phone'
   },
   {
      title: "Email",
      dataIndex: "email",
      key: 'email'
   },{
      title: "Country",
      dataIndex: "country",
      key: 'country'
   },{
   title: "Role",
   dataIndex: "role",
   key:"role",
   sorter: (a, b) => a.role.localeCompare(b.role),
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
 axios.delete(`http://localhost:3000/user/${recordToDelete}`, {headers: {Authorization: `Bearer ${access_token}`}}).then((res) => {
    toast.success(res.data.message);
    fetchUser();
 }).catch(e => toast.warn("Something wrong!"))
 setIsModalDeleteOpen(false);
};

const handleCancelDelete = () => {
 setIsModalDeleteOpen(false);
};

const handleOkEdit = (values) => {
   axios.patch(`http://localhost:3000/user/${recordToEdit}`, values, {headers: {Authorization: `Bearer ${access_token}`}}).then(res => {
      toast.success(res.data.message);
      setIsModalEditOpen(false);
      fetchUser();
   }).catch(e => toast.error(e))

}
const handleCancelEdit = () => {
setIsModalEditOpen(false)
}
return (
 
  <div>
    <div>
      <Modal title="Edit User" open={isModalEditOpen} onOk={() => formForEdit.submit()} onCancel={handleCancelEdit}>
         <Form form={formForEdit} onFinish={handleOkEdit} layout='vertical'>
         <Form.Item label="First Name" name={"firstname"} rules={[{ required: true }]}>
          <Input/>
       </Form.Item>
       <Form.Item label="Last Name" name={"lastname"} rules={[{ required: true }]}>
          <Input/>
       </Form.Item>
       <Form.Item label="Phone Number" name={"phone"} rules={[{ required: true }]}>
          <Input type='number' min={0}/>
       </Form.Item>
       <Form.Item label="Country" name={"country"} rules={[{ required: true }]}>
          <Input/>
       </Form.Item>
       <Form.Item label="Email" name={"email"} rules={[{ required: true }]}>
          <Input/>
       </Form.Item>
       <Form.Item label="Role" name={"role"} rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="User">User</Select.Option>
          </Select>
        </Form.Item>
         </Form>
      </Modal>
    <Modal title="Are you sure want to delete? " open={isModalDeleteOpen} onOk={handleOkDelete} onCancel={handleCancelDelete}></Modal>
    <Button type='primary' style={{margin: 10}} onClick={showModal}> Add User</Button>
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
      title=" Add User"
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
       <Form.Item label="First Name" name={"firstname"} rules={[{ required: true }]}>
          <Input/>
       </Form.Item>
       <Form.Item label="Last Name" name={"lastname"} rules={[{ required: true }]}>
          <Input/>
       </Form.Item>
       <Form.Item label="Phone Number" name={"phone"} rules={[{ required: true }]}>
          <Input type='number' min={0}/>
       </Form.Item>
       <Form.Item label="Country" name={"country"} rules={[{ required: true }]}>
          <Input/>
       </Form.Item>
       <Form.Item label="Email" name={"email"} rules={[{ required: true }]}>
          <Input/>
       </Form.Item>
       <Form.Item label="Password" name={"password"}rules={[{ required: true }]}>
          <Input type='password'/>
       </Form.Item>
       <Form.Item label="Role" name={"role"} rules={[{ required: true }]}>
          <Select>
            <Select.Option value="Admin">Admin</Select.Option>
            <Select.Option value="User">User</Select.Option>
          </Select>
        </Form.Item>
    </Form>
    </Modal>
  </div>
    );
};
export default User;
