import React, { useState } from "react";

export const GradeRow = ({ grade, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(grade);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(grade.id, formData);
    setIsEditing(false);
  };

  return (
    <tr>
      <td>{grade.id}</td>
      {isEditing ? (
        <>
          <td>
            <input value={formData.name} onChange={handleChange("name")} />
          </td>
          <td>
            <input value={formData.korean} onChange={handleChange("korean")} />
          </td>
          <td>
            <input value={formData.math} onChange={handleChange("math")} />
          </td>
          <td>
            <input
              value={formData.english}
              onChange={handleChange("english")}
            />
          </td>
          <td>
            <input
              value={formData.society}
              onChange={handleChange("society")}
            />
          </td>
          <td>
            <input
              value={formData.science}
              onChange={handleChange("science")}
            />
          </td>
          <td>
            <input value={formData.art} onChange={handleChange("art")} />
          </td>
          <td>
            <input value={formData.music} onChange={handleChange("music")} />
          </td>
          <td>
            <input value={formData.pe} onChange={handleChange("pe")} />
          </td>
          <td>
            <button onClick={handleSave}>💾</button>
          </td>
        </>
      ) : (
        <>
          <td>{grade.name}</td>
          <td>{grade.korean}</td>
          <td>{grade.math}</td>
          <td>{grade.english}</td>
          <td>{grade.society}</td>
          <td>{grade.science}</td>
          <td>{grade.art}</td>
          <td>{grade.music}</td>
          <td>{grade.pe}</td>
          <td>
            <button onClick={() => setIsEditing(true)}>✏️</button>
            <button onClick={() => onDelete(grade.id)}>🗑️</button>
          </td>
        </>
      )}
    </tr>
  );
};
