import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { Button, Modal, Table } from 'antd'
import moment from 'moment'
import Search from 'antd/es/input/Search'
import { toast } from 'react-toastify'

const ConfirmBooking = () => {
   const [data, setData] = useState([])
   const access_token = Cookies.get('a_t')
   const [searchText, setSearchText] = useState('');
   const [isModalCancelOpen, setIsModalCancelOpen] = useState(false);
   const [recordToCancel,setRecordToCancel] = useState('')
   const [ isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
   const [recordToConfirm,setRecordToConfirm] = useState('')

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
     return (
        lastNameLower.includes(searchTextLower) ||
        phone.includes(searchTextLower) ||
        email.includes(searchTextLower) 
      );
   });
  }
   const fetchDataTable = () => {
      axios.get('http://localhost:3000/bookings/unconfirm', {headers: {Authorization: `Bearer ${access_token}`}}).then(res => {
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
      "Đã thanh toán": 'green',
      "Chưa thanh toán": 'orange',
    };

    const showModalCancel = (id) => {
      setRecordToCancel(id);
      setIsModalCancelOpen(true);
     };

     const showModalConfirm = (id) => {
      setRecordToConfirm(id)
      setIsModalConfirmOpen(true)
     }
    
    const handleOkCancel = () => {
      axios.put(`http://localhost:3000/bookings/${recordToCancel}`,null, {headers: {Authorization: `Bearer ${access_token}`}}).then((res) => {
         toast.success(res.data.message);
         fetchDataTable();
      }).catch(e => console.log(e));
      setIsModalCancelOpen(false);
     };
     const handleCancelDelete = () => {
      setIsModalCancelOpen(false);
     };
     const handleOkConfirm = () => {
      axios.patch(`http://localhost:3000/bookings/${recordToConfirm}`,null, {headers: {Authorization: `Bearer ${access_token}`}}).then((res) => {
         toast.success(res.data.message);
         fetchDataTable();
      }).catch(e => console.log(e));
      setIsModalConfirmOpen(false);
     }
     const handleConfirmDelete = () => {
      setIsModalConfirmOpen(false)
     }
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
         sorter: (a, b) => a.status.localeCompare(b.status),
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
         title: "Action",
         render: (text, record) => {
            return (
               <div>
                  <Button danger style={{color: "#26c61b", borderColor: "#26c61b"}} onClick={() => {
                     showModalConfirm(record._id);
                  }}>Confirm</Button>
                  <Button danger style={{marginRight: 10}} onClick={() => {
                     showModalCancel(record._id)
                  }} >Hủy</Button>
                  
               </div>
            )
         }
      }
   ]
  return (
   <div>
      <Modal title="Are you sure want to confirm booking? " open={isModalConfirmOpen} onOk={handleOkConfirm} onCancel={handleConfirmDelete}></Modal>
      <Modal title="Are you sure want to cancel booking? " open={isModalCancelOpen} onOk={handleOkCancel} onCancel={handleCancelDelete}></Modal>
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

export default ConfirmBooking