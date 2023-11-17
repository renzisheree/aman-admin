/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Button, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Upload } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import TextArea from 'antd/es/input/TextArea';
import { ConsoleSqlOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import {toast} from 'react-toastify';
import Cookies from 'js-cookie'

interface DataType {
   _id: string;
   key: string; 
   name: string;
   descriptions: string;
   price: number;
   size: number;
   max_adults: number;
   max_children: number;
}

 
 
  const Rooms = () => {
     const [data, setData] = useState([]);
     const [open, setOpen] = useState(false);
     const [confirmLoading, setConfirmLoading] = useState(false);
     const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
     const [recordToDelete, setRecordToDelete] = useState(null);
     const [recordToEdit, setRecordToEdit] = useState(null);
     const [isModalEditOpen, setIsModalEditOpen] = useState(false)

     const access_token = Cookies.get('a_t');


    const handleDeleteRoom = (id: string) => {

    }
    const [roomTypes, setRoomTypes] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [searchText, setSearchText] = useState('');
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
//handle modal open when click button add Room
     const showModal = () => {
      setOpen(true);
    };
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:3000/rooms');
        if(!response.data) {
           return {error: response.status}
        }
        setData(response.data?.items);
      } catch (error) {
        console.log(error);
      }
    }

   function base64ToFile(base64, fileName, mimeType) {
      const byteCharacters = atob(base64);
      const byteArrays = [];
    
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
    
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
    
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
    
      const blob = new Blob(byteArrays);
      return new File([blob], fileName, { type: mimeType });
}
     const handleSubmit = async (values) => {
      console.log(values)
      const formData = new FormData();
      const imageCover = values.imageCover?.fileList;
      const imageThumbnail = values.imageThumbnail?.fileList;
      for(let i = 0; i < imageCover.length; i ++) {
         const file = base64ToFile(imageCover[i].thumbUrl.split(",")[1], imageCover[i].name, imageCover[i].type);
         formData.append(`imageCover`,file);
      }
      for(let i = 0; i < imageThumbnail.length; i ++) {
         const file = base64ToFile(imageThumbnail[i].thumbUrl.split(",")[1], imageThumbnail[i].name, imageThumbnail[i].type);
         formData.append(`imageThumbnail`,file);
      }
      const amenities = values.amenities;
      for(let i = 0; i < amenities.length; i++) {
         formData.append(`amenities[${i}]`, amenities[i])
      }
      formData.append('description', values?.description);
      formData.append('name', values?.name);
      formData.append('price', values?.price);
      formData.append('max_adults', values?.max_adults);
      formData.append('max_children', values?.max_children);
      formData.append('roomType', values?.roomType);
      formData.append('size', values?.size);
      console.log([...formData])
      try {
         axios({url:"http://localhost:3000/rooms", method: "POST", headers: {"Content-Type": "multipart/form-data" ,Authorization: `Bearer ${access_token}`}, data: formData}).then((res) => {
            toast.success(res.data.message)
            setOpen(false);
         setConfirmLoading(false);
         fetchRooms()
         }).catch((e) => {
            toast.error("Something Wrong");
         setConfirmLoading(false);
            console.log(e)
         })
         
         
      } catch(e) {
         console.log(e)
         setConfirmLoading(false);
      }
    };
    const handleCancel = () => {
      setOpen(false);
      form.resetFields();
    };
    //----------------------------------
    const [formForEdit] = Form.useForm();
    const handleSubmitEdit = (id) => {
      setRecordToEdit(id);
      setIsModalEditOpen(true);
      axios.get(`http://localhost:3000/room/${id}`, {headers: {Authorization: `Bearer ${access_token}`}}).then(res => {
      const data = res.data.room;
      formForEdit.setFieldsValue({
         name: data.name,
         description: data.description,
         size: data.size,
         price: data.price,
         max_adults: data.max_adults,
         max_children: data.max_children,
         roomType: data.roomType,
         amenities: data.amenities
      });
   }).catch(e => console.log(e))
    }
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
         title: "Description",
         dataIndex: "description",
         key: "description",
         ellipsis: true
      },
      {
         title: "Price",
         dataIndex: "price",
         key: "price",
         sorter: (a, b) => a.price - b.price,
      },
      {
         title: "Max Adults",
         dataIndex: "max_adults",
         key: "max_adults",
         sorter: (a, b) => a.max_adults - b.max_adults,
      },
      {
         title: "Max Children",
         dataIndex: "max_children",
         key: "max_children",
         sorter: (a, b) => a.max_children - b.max_children,
      },
      {
         title: "Size Room",
         dataIndex: "size",
         key: "size",
         sorter: (a, b) => a.size - b.size,
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
                     handleSubmitEdit(record._id)
                  }}>Edit</Button>
               </div>
            )
         }
      }
    ]
    
useEffect(() => {
  
  fetchRooms();
}, [data]);
useEffect(() => {
   async function fetchData() {
      try {
     const response = await axios.get('http://localhost:3000/room-types/all');
     if(!response.data) {
      return {error: response.status}
   }
   setRoomTypes(response.data?.items);
 } catch (error) {
   console.log(error);
 }
}
   fetchData();
 }, []);
 useEffect(() => {
   async function fetchData() {
      try {
     const response = await axios.get('http://localhost:3000/amenities');
     if(!response.data) {
      return {error: response.status}
   }
   setAmenities(response.data?.items);
 } catch (error) {
   console.log(error);
 }
}
   fetchData();
 }, []);
const [form] = Form.useForm();
const showModalDelete = (id) => {
   setRecordToDelete(id);
   setIsModalDeleteOpen(true);
 };

 const handleOkDelete = () => {
   axios.delete(`http://localhost:3000/rooms/${recordToDelete}`, {headers: {Authorization: `Bearer ${access_token}`}}).then((res) => {
      toast.success(res.data.message);
      fetchRooms();
   }).catch(e => toast.warn("Something wrong!"))
   setIsModalDeleteOpen(false);
 };

 const handleCancelDelete = () => {
   setIsModalDeleteOpen(false);
 };
 
const handleOkEdit = (values) =>{
   console.log(values);
   axios.patch(`http://localhost:3000/room/${recordToEdit}`, values, {headers: {Authorization: `Bearer ${access_token}`}}).then(res => {
      toast.success(res.data.message);
      setIsModalEditOpen(false);
      fetchRooms();
   }).catch(e => console.log(e))

}
const handleCancelEdit = () => {
setIsModalEditOpen(false);
}
  return (
   
    <div>
      <div>
         <Modal title="Edit Room" open={isModalEditOpen} onOk={() => formForEdit.submit()} onCancel={handleCancelEdit}>
         <Form onFinish={handleOkEdit} form={formForEdit} layout='vertical'>

      <Form.Item label="Room Name" name={"name"} >
      <Input placeholder='Tên phòng của bạn'/>
      </Form.Item>
      <Form.Item label="Description" name={"description"}>
          <TextArea rows={4} placeholder='Mô tả gì đó về phòng của bạn' />
        </Form.Item>
        <div className="block__number" style={{display: "flex", gap:15}}>
        <Form.Item label="Room size" name={"size"}>
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        <Form.Item label="Price" name={"price"}>
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        <Form.Item label="Max Adults" name={"max_adults"}>
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        <Form.Item label="Max Children" name={"max_children"}>
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        </div>
        <Form.Item label="Room Type" name={"roomType"}>
          <Select>
          {roomTypes.map(item => (
    <Select.Option key={item._id} value={item._id}>
      {item.name}
    </Select.Option>
  ))}
          </Select>
        </Form.Item>
        <Form.Item label="Amenities" name={"amenities"}>
        <Select 
         mode="multiple"
         options={amenities.map(item => ({
         value: item._id,
         label: item.name
         }))}
/>
        </Form.Item>
         </Form>
         </Modal>
      <Modal title="Are you sure want to delete? " open={isModalDeleteOpen} onOk={handleOkDelete} onCancel={handleCancelDelete}></Modal>
      <Button type='primary' style={{margin: 10}} onClick={showModal}> Add Room</Button>
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
       width="50%" closable={false}
        title=" Add Room"
        open={open}
        onOk={() => {
         form.submit()
        }}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
      <Form form={form} onFinish={handleSubmit}
      layout='vertical'
      style={{display: "flex"}}
      >
      <div className="left" style={{width: "50%", marginRight: 20}}>
      <Form.Item label="Room Name" name={"name"} >
      <Input placeholder='Tên phòng của bạn'/>
      </Form.Item>
      <Form.Item label="Description" name={"description"}>
          <TextArea rows={4} placeholder='Mô tả gì đó về phòng của bạn' />
        </Form.Item>
        <div className="block__number" style={{display: "flex", gap:15}}>
        <Form.Item label="Room size" name={"size"}>
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        <Form.Item label="Price" name={"price"}>
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        <Form.Item label="Max Adults" name={"max_adults"}>
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        <Form.Item label="Max Children" name={"max_children"}>
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        </div>
      </div>
      <div className="right" style={{width: "50%"}}>
      <Form.Item label="Upload Image Thumbnail" name={"imageThumbnail"}>
          <Upload
          beforeUpload={() => false}
         listType="picture"
         maxCount={10} >
          <Button icon={<UploadOutlined />}>Upload (Max: 10)</Button>
          </Upload>
      </Form.Item>
      <Form.Item label="Upload Image Cover" name={"imageCover"}>
          <Upload
          beforeUpload={(file, fileList) => {
            return false
          }}
         listType="picture"
         maxCount={10} >
          <Button icon={<UploadOutlined />}>Upload (Max: 2)</Button>
          </Upload>
      </Form.Item>
      <Form.Item label="Room Type" name={"roomType"}>
          <Select>
          {roomTypes.map(item => (
    <Select.Option key={item._id} value={item._id}>
      {item.name}
    </Select.Option>
  ))}
          </Select>
        </Form.Item>
        <Form.Item label="Amenities" name={"amenities"}>
        <Select 
         mode="multiple"
         options={amenities.map(item => ({
         value: item._id,
         label: item.name
         }))}
/>
        </Form.Item>
      </div>
      </Form>
      </Modal>
    </div>
      );
};

export default Rooms;
