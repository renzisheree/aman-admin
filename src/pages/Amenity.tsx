import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Form, Input, Modal, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TextArea from 'antd/es/input/TextArea';
import {  MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import {toast} from 'react-toastify';
import Cookies from 'js-cookie'
 const Amenity = () => {
   const [data, setData] = useState([]);
   const [open, setOpen] = useState(false);
   const [confirmLoading, setConfirmLoading] = useState(false);
   const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
   const [isModalEditOpen, setIsModalEditOpen] = useState(false)
   const [recordToDelete, setRecordToDelete] = useState(null);
   const [recordToEdit, setRecordToEdit] = useState(null);
   const access_token = Cookies.get('a_t');
  
  const [searchText, setSearchText] = useState('');
  const [textAmenity, setTextAmenity] = useState('');
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
const fetchAmenities = async () => {
 try {
    const response = await axios.get('http://localhost:3000/amenities')
    if(!response.data) {
       return {error: response.status}
    }
    console.log(response.data.items);
    setData(response.data?.items);
 } catch (error) {
    console.log(error);
 }
}
useEffect(() => {
 fetchAmenities()
}, [])
//handle modal open when click button add amenity
   const showModal = () => {
    setOpen(true);
  };
   const handleSubmit = async (values) => {
    try {
       const response = await axios.post('http://localhost:3000/room/amenities', values, {headers: {Authorization: `Bearer ${access_token}`}});
          toast.success(response.data.message);
          setOpen(false);
          setConfirmLoading(false);
          fetchAmenities()
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
       title: "Name",
       dataIndex: "name",
       key: 'name'
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
 axios.delete(`http://localhost:3000/amenity/${recordToDelete}`, {headers: {Authorization: `Bearer ${access_token}`}}).then((res) => {
    toast.success(res.data.message);
    fetchAmenities();
 }).catch(e => toast.warn("Something wrong!"))
 setIsModalDeleteOpen(false);
};

const handleCancelDelete = () => {
 setIsModalDeleteOpen(false);
};
const handleOkEdit = () =>{
   const inputValue = textAmenity;
   axios.patch(`http://localhost:3000/amenity/${recordToEdit}`, {name: inputValue}, {headers: {Authorization: `Bearer ${access_token}`}}).then((res) => {
      setIsModalEditOpen(false);
      toast.success(res.data.message)
      fetchAmenities()
   }).catch(e => toast.error(e))

}
const handleCancelEdit = () => {
   setIsModalEditOpen(false);
}
const showModalEdit = (id) => {
   setRecordToEdit(id);
 setIsModalEditOpen(true);
 axios.get(`http://localhost:3000/amenity/${id}`, {headers: {Authorization: `Bearer ${access_token}`}}).then((res => {
   setTextAmenity(res.data.amenity.name)
 })).catch(e  => console.log(e))
}

return (
 
  <div>
    <div>
    <Modal title="Edit Amenity " open={isModalEditOpen} onOk={handleOkEdit} onCancel={handleCancelEdit}>
          <Input value={textAmenity} onChange={(e) => setTextAmenity(e.target.value)}/>
      </Modal>  
    <Modal title="Are you sure want to delete? " open={isModalDeleteOpen} onOk={handleOkDelete} onCancel={handleCancelDelete}></Modal>
    <Button type='primary' style={{margin: 10}} onClick={showModal}> Add Amenity</Button>
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
      title=" Add Amenity"
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
       <Form.Item label="Name" name={"name"}>
          <Input/>
       </Form.Item>
    </Form>
    </Modal>
  </div>
    );
};
export default Amenity;
