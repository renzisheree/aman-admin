/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import {ContentHeader} from '@components';
import useAxios from '@app/hooks/useAxios';

interface BlankProps {
path : string;
name : string;
description : string;
}

interface RoomTypesResponse {
  items: BlankProps[] 
}

const Blank = () => {

  const { data, loading, error } = useAxios(
    "http://localhost:3000/room-types/all"
  );


if(!data) return;
const {items} = data;
console.log(data);
  console.log(items);
  return (
    <div>
      <ContentHeader title="Room management" />

      <button className='p-20' > Add new type
</button>
      <section className="content">
        <div className="container-fluid">
    {items.map((item: BlankProps)  => (


<div className="card">
<div className="card-header">
  <h3 className="card-title">{item.name}</h3>
  <div className="card-tools">
    <button
      type="button"
      className="btn btn-tool"
      data-widget="collapse"
      data-toggle="tooltip"
      title="Collapse"
    >
      <i className="fa fa-minus" />
    </button>
    <button
      type="button"
      className="btn btn-tool"
      data-widget="remove"
      data-toggle="tooltip"
      title="Remove"
    >
      <i className="fa fa-times" />
    </button>
  </div>
</div>
<div className="card-body">
 {item.description}</div>
<div className="card-footer">{item.path}</div>
</div>
    ))}
        </div>
       
      </section>
    </div>
  );
};

export default Blank;
