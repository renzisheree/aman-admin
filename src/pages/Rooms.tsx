/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import {ContentHeader} from '@components';
import DataTable from 'react-data-table-component';
import axios from 'axios'
import {Button, Modal, Form, Input, InputNumber, Upload} from 'antd'
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
import { PlusOutlined } from '@ant-design/icons';


const truncateDescription = (description: string, maxLength: number) => {
   if (description.length <= maxLength) {
     return description;
   }
 
   return `${description.substring(0, maxLength)}...`;
 };
 
const columns = [
   {
       name: 'ID',
       selector: row => row?._id,
   },
   {
       name: 'Name',
       selector: row => row?.name,
   },
   {
      name: 'Description',
      selector: row => truncateDescription(row?.description, 100),
   }
];

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

  const Rooms = () => {
     const [data, setData] = useState([]);
     const [open, setOpen] = useState(false);
     const [previewOpen, setPreviewOpen] = useState(false);
     const [previewImage, setPreviewImage] = useState('');
     const [previewTitle, setPreviewTitle] = useState('');
     const [fileList, setFileList] = useState<UploadFile[]>([]);
     const handleCanceled = () => setPreviewOpen(false);

     const handlePreview = async (file: UploadFile) => {
       if (!file.url && !file.preview) {
         file.preview = await getBase64(file.originFileObj as RcFile);
       }
   
       setPreviewImage(file.url || (file.preview as string));
       setPreviewOpen(true);
       setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
     };
     const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
     setFileList(newFileList);
 
   const uploadButton = (
     <div>
       <PlusOutlined />
       <div style={{ marginTop: 8 }}>Upload</div>
     </div>
   );
useEffect(() => {
  const fetchData = async () => {
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

  fetchData();
}, []);

const showModal = () => {
  setOpen(true);
};
const handleOk = () => {
  setOpen(false);
};

const handleCancel = () => {
  setOpen(false);
};
  return (
   
    <div>
      <Button type="primary" onClick={showModal} style={{margin: 10}}>
          Thêm Phòng
        </Button>
      <Modal
        open={open}
        title="Thêm phòng"
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Form className='d-flex'
        style={{gap: 20}}
        wrapperCol={{ span: 20 }}
        layout="horizontal" >
        <div>
        <Form.Item label="Tên Phòng">
         <Input/>
        </Form.Item>
        <Form.Item label="Description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Diện tích">
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        </div>
        <div style={{marginRight: 20}}>
        <Form.Item label="Hình ảnh phòng">
        <Upload
        action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCanceled}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
        </Form.Item>
        </div>
        </Form>
        
      </Modal>
         <DataTable
         columns={columns}
         data={data}
         selectableRows
         pagination
         />
    </div>
  );
};

export default Rooms;
