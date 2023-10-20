/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import {ContentHeader} from '@components';
import amenData from "../data/amenitiesData.json"

interface Props {
  file: File;
}

const SubMenu = () => {


  return (
    <div>
      <ContentHeader title="Add new room" />
      <section className="content">
        <div className="container-fluid">


          <form action=""> <div className="card">
            <div className="card-header">
          
          
            </div>
            <div className="card-body d-flex">
       <div className="left-card-body_content p-5 d-flex flex-column align-items-start
 justify-content-around gap-3
">

       <div className="background_img_selector">

<label htmlFor="bgImage">Select background image</label>

<ImagePreview />
</div>
  <div className="cover_img_selector d-flex flex-column ">

<label htmlFor="files">Select cover images</label>

<input type="file" id='files' name='files' multiple />

</div>
       </div>
       <div className="right-card-body_content p-5">

        <div className="radiobox grid">

       {amenData.map((data) => 

       ( <div className=''><label className="container">{data.src}
       <input type="checkbox"/> </label></div>))}
 


        </div>
        <div className="description d-flex flex-column">

          
        <label htmlFor="des">Description</label>

<textarea name="des" id="des" cols={50} rows={5}  ></textarea>
        </div>

     

        </div>
       </div>
            
            <div className="card-footer">

              <button type='submit'>Submit this fking form</button>
            </div>
          </div></form>
         
        </div>
      </section>
    </div>
  );
};


function ImagePreview() {

  const [selectedFile, setSelectedFile] = useState(null); 
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl as any);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl); 
  }, [selectedFile]);


  const onSelectFile = (e: { target: { files: string | any[]; }; })  => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(e.target.files[0]);
  }
 
  return (
    <div className='d-flex flex-column'>
      
      {preview && <img src={preview} alt="Preview" width={350} height={350} /> }
      <input type="file" onChange={onSelectFile} />
    </div>
  )
  }

export default SubMenu;
