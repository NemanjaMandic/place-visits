import React, { useRef, useState, useEffect } from 'react';
import './ImageUpload.css';
import Button from '../FormElements/Button';

const ImageUpload = ({ id, center, onInput, errorText }) => {
  const fpRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if(!file){
        return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file)
    console.log(fileReader)
  }, [file]);



  const pickImageHandler = () => {
    fpRef.current.click();
  };

  const pickedHandler = e => {
      let pickedFile;
      let fileIsValid = isValid;
    if(e.target.files && e.target.files.length === 1){
        pickedFile = e.target.files[0];
        setFile(pickedFile);
        setIsValid(true);
        fileIsValid = true;
    }else{
        setIsValid(false);
        fileIsValid = false;
    }
    onInput(id, pickedFile, fileIsValid);
  }
  return (
    <div className='form-control'>
      <input
        id={id}
        ref={fpRef}
        style={{ display: 'none' }}
        type='file'
        accept='.jpg, .png, .jpeg'
        onChange={pickedHandler}
      />
      <div className={`image-upload ${center && 'center'}`}>
        <div className='image-upload__preview'>
          {previewUrl ? <img src={previewUrl} alt='Preview' /> : <p>Please pick an image.</p>}
        </div>
        <Button type='button' onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{errorText}</p>}
    </div>
  );
};

export default ImageUpload;
