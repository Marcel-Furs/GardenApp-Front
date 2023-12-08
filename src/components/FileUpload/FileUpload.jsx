import React, { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../api/urls.component";

export const FileUpload = () => {
  const [fileSelected, setFileSelected] = useState();

  const saveFileSelected= (e) => {
    setFileSelected(e.target.files[0]);
  };

  const importFile= async (e) => {
    const formData = new FormData();
    formData.append("file", fileSelected);
    try {
      const res = await axios.post(ENDPOINTS.UploadFile, formData);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <>
      <input type="file" onChange={saveFileSelected} />
      <input type="button" value="upload" onClick={importFile} />
    </>
  );
};