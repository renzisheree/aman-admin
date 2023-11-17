import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Button, Modal, Table } from 'antd'
import moment from 'moment'
import Search from 'antd/es/input/Search'
import { toast } from 'react-toastify'

const Booking = () => {
   const [data, setData] = useState([])
   const access_token = Cookies.get('a_t')
   const [searchText, setSearchText] = useState('');
   const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
   const [recordToDelete,setRecordToDelete] = useState('')

   const onSearch = (value) => {
      setSearchText(value);
    }
   let filteredData = data; 
  
  if (searchText) {
   const searchTextLower = searchText.toLowerCase();
   filteredData = data.filter(item => {
     const lastNameLower = item?.lastName.toLowerCase();
     const firstNameLower = item?.firstName.toLowerCase();
     const phone = item?.phone;
     const email = item?.email.toLowerCase();
     const status = item?.status.toLowerCase();
     return (
        lastNameLower.includes(searchTextLower) ||
        firstNameLower.includes(searchTextLower) ||
        phone.includes(searchTextLower) ||
        email.includes(searchTextLower) ||
        status.includes(searchTextLower)
      );
   });
  }
   const fetchDataTable = () => {
      axios.get('http://localhost:3000/bookings', {headers: {Authorization: `Bearer ${access_token}`}}).then(res => {
         console.log(res.data.items);
         setData(res.data.items)
      }).catch(error => console.log(error))
   }
   useEffect(() => {
      fetchDataTable();
   }, [])
   const statusColors = {
      "Đã xác nhận": 'green',
      "Hủy": 'red',
      "Chưa xác nhận": 'orange',
    };
    const statusPaymentColors = {
      "Đã Thanh toán": 'green',
      "Chưa Thanh toán": 'orange',
    };

    const showModalDelete = (id) => {
      setRecordToDelete(id);
      setIsModalDeleteOpen(true);
     };
    
    const handleOkDelete = () => {
      axios.delete(`http://localhost:3000/bookings/${recordToDelete}`, {headers: {Authorization: `Bearer ${access_token}`}}).then((res) => {
         toast.success(res.data.message);
         fetchDataTable();
      }).catch(e => toast.warn("Something wrong!"))
      setIsModalDeleteOpen(false);
     };
     const handleCancelDelete = () => {
      setIsModalDeleteOpen(false);
     };
   const columns = [
      {
         title: "ID",
         dataIndex: "_id",
         key: "_id"
      },
      {
         title: "Name",
         dataIndex: "fullName",
         key: "fullName",
         render: (_, record) => `${record.firstName} ${record.lastName}`,

         
      },
      {
         title: "Phone Number",
         dataIndex: "phone",
         key: "phone",
      },
      {
         title: "Room Booking",
         dataIndex: "rooms",
         key: "rooms",
         render: (rooms) => rooms.map((room) => room.name).join(', '),
      },
      {
         title: "Note",
         dataIndex: "note",
         key: "note",
         ellipsis: true
      },
      {
         title: "Check In",
         dataIndex: "start",
         key: "start",
         render: (start) => moment(start).format('DD/MM/YYYY'),
         sorter: (a, b) => moment(a.start) - moment(b.start),
    sortDirections: ['ascend', 'descend'],

      },
      {
         title: "Check Out",
         dataIndex: "end",
         key: "end",
         render: (end) => moment(end).format('DD/MM/YYYY'),

         sorter: (a, b) => moment(a.end) - moment(b.end),
    sortDirections: ['ascend', 'descend'],
      },
      {
         title: "Status",
         dataIndex: "status",
         key: "status",
         filters: [
            {
              text: 'Confirm',
              value: 'Đã xác nhận',
            },
            {
              text: 'UnConfirm',
              value: 'Chưa xác nhận',
            },
            {
               text: 'Cancel',
               value: 'Hủy',
             },
         ],
         sorter: (a, b) => a.status.localeCompare(b.status),
         onFilter: (value: string, record) => record.status.indexOf(value) === 0,
         render: (status) => (
            <span
              style={{
                color: statusColors[status],
              }}
            >
              {status}
            </span>
          ),
      },
      {
         title: "Status Payment",
         dataIndex: "payment_status",
         key: "payment_status",
         render: (payment_status) => (
            <span
              style={{
                color: statusPaymentColors[payment_status],
              }}
            >
              {payment_status}
            </span>
          ),
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
                     console.log(record._id);
                  }}>Edit</Button>
               </div>
            )
         }
      }
   ]
  return (
   <div>
      <Modal title="Are you sure want to delete? " open={isModalDeleteOpen} onOk={handleOkDelete} onCancel={handleCancelDelete}></Modal>
      <Search
    placeholder="input search text"
    allowClear
    enterButton="Search"
    size="large"
    onSearch={onSearch}
    style={{ width: 500, display: "block" }} 
  />
      <Table columns={columns} dataSource={filteredData} childrenColumnName="antdChildren" />
   </div>
  )
}

export default Booking