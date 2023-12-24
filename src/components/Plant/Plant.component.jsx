import React, { useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../api/urls.component";
import "./Plant.component.css";

const Grid = () => {
  const [fileSelected, setFileSelected] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileDescription, setFileDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [selectedElement, setSelectedElement] = useState(""); // Dodane pole wyboru

  const saveFileSelected = (e) => {
    setFileSelected(e.target.files[0]);

    // Wyświetlenie obrazu na stronie
    const reader = new FileReader();
    reader.onload = () => {
      setFileUrl(reader.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleFileDescriptionChange = (e) => {
    setFileDescription(e.target.value);
  };

  const handleElementChange = (e) => {
    setSelectedElement(e.target.value);
  };

  const importFile = async () => {
    const formData = new FormData();
    formData.append("Image", fileSelected);
    formData.append("PlantName", fileName);
    //formData.append("fileDescription", fileDescription);
    //formData.append("selectedElement", selectedElement);

    try {
      const res = await axios.post(ENDPOINTS.UploadFile, formData);
      console.log(res.data); // Do something with the response if needed
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
 
    <div className="grid-container">
      <div className="grid-item">
        <div className="file-input-container">
          <input type="file" onChange={saveFileSelected} />
          <input type="button" value="Upload" onClick={importFile} />
        </div>

        {fileSelected && (
          <div className="preview-container">
            <img src={fileUrl} alt="Preview" />
          </div>
        )}

        <div>
          <label>Nazwa rośliny:</label>
          <input type="text" value={fileName} onChange={handleFileNameChange} />
        </div>

        <div>
          <label>Opis rośliny:</label>
          <input
            type="text"
            value={fileDescription}
            onChange={handleFileDescriptionChange}
          />
        </div>

        {/* Dodane pole wyboru */}
        <div>
          <label>Wybierz rodzaj rośliny:</label>
          <select value={selectedElement} onChange={handleElementChange}>
            <option value="element1">Warzywo</option>
            <option value="element2">Kwiat</option>
            <option value="element2">Drzewo</option>
            {/* Dodaj więcej opcji według potrzeb */}
          </select>
        </div>
      </div>
    </div>

  );
};

export default Grid;
