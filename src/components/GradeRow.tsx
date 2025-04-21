// GradeRow.tsx
// GradeRowEx.tsx로 대신 사용 중.
// import React, { useState } from "react";
// import styled from "styled-components";

// const CustomInput = styled.input`
//   border: 1px solid #7c7c7c;
//   border-radius: 0.75rem;
//   width: 4rem;
//   height: 1.75rem;

//   background-color: transparent;

//   color: black;
//   font-size: 1rem;
//   text-align: center;

//   &:placeholder {
//     color: gray;
//   }
// `;

// const EditButton = styled.button`
//   margin: 0 0.25rem;
//   border: none;
//   background-color: transparent;
//   font-size: 1rem;
// `;

// export const GradeRow: React.FC = ({ grade, onUpdate, onDelete }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     nameInput: "",
//     koreanInput: "",
//     mathInput: "",
//     englishInput: "",
//     societyInput: "",
//     scienceInput: "",
//     artInput: "",
//     musicInput: "",
//     peInput: "",
//   });

//   const handleChange = (field) => (e) => {
//     setFormData({ ...formData, [field]: e.target.value });
//   };

//   // const handleSave = () => {
//   //   onUpdate(grade.id, formData);
//   //   setIsEditing(false);
//   // };

//   const handleSave = () => {
//     const updated = {
//       name: formData.nameInput !== "" ? formData.nameInput : grade.name,
//       korean: formData.koreanInput !== "" ? formData.koreanInput : grade.korean,
//       math: formData.mathInput !== "" ? formData.mathInput : grade.math,
//       english:
//         formData.englishInput !== "" ? formData.englishInput : grade.english,
//       society:
//         formData.societyInput !== "" ? formData.societyInput : grade.society,
//       science:
//         formData.scienceInput !== "" ? formData.scienceInput : grade.science,
//       art: formData.artInput !== "" ? formData.artInput : grade.art,
//       music: formData.musicInput !== "" ? formData.musicInput : grade.music,
//       pe: formData.peInput !== "" ? formData.peInput : grade.pe,
//     };

//     onUpdate(grade.id, updated);
//     setIsEditing(false);
//   };

//   return (
//     <tr>
//       <td>{grade.id}</td>
//       {isEditing ? (
//         <>
//           <td>
//             <CustomInput
//               value={formData.nameInput}
//               placeholder={grade.name}
//               onChange={handleChange("nameInput")}
//             />
//           </td>
//           <td>
//             <CustomInput
//               value={formData.koreanInput}
//               placeholder={String(grade.korean)}
//               onChange={handleChange("koreanInput")}
//             />
//           </td>
//           <td>
//             <CustomInput
//               value={formData.mathInput}
//               placeholder={String(grade.math)}
//               onChange={handleChange("mathInput")}
//             />
//           </td>
//           <td>
//             <CustomInput
//               value={formData.englishInput}
//               placeholder={String(grade.english)}
//               onChange={handleChange("englishInput")}
//             />
//           </td>
//           <td>
//             <CustomInput
//               value={formData.societyInput}
//               placeholder={String(grade.society)}
//               onChange={handleChange("societyInput")}
//             />
//           </td>
//           <td>
//             <CustomInput
//               value={formData.scienceInput}
//               placeholder={String(grade.science)}
//               onChange={handleChange("scienceInput")}
//             />
//           </td>
//           <td>
//             <CustomInput
//               value={formData.artInput}
//               placeholder={String(grade.art)}
//               onChange={handleChange("artInput")}
//             />
//           </td>
//           <td>
//             <CustomInput
//               value={formData.musicInput}
//               placeholder={String(grade.music)}
//               onChange={handleChange("musicInput")}
//             />
//           </td>
//           <td>
//             <CustomInput
//               value={formData.peInput}
//               placeholder={String(grade.pe)}
//               onChange={handleChange("peInput")}
//             />
//           </td>
//           <td>
//             <button onClick={handleSave}>💾</button>
//           </td>
//         </>
//       ) : (
//         <>
//           <td>{grade.name}</td>
//           <td>{grade.korean}</td>
//           <td>{grade.math}</td>
//           <td>{grade.english}</td>
//           <td>{grade.society}</td>
//           <td>{grade.science}</td>
//           <td>{grade.art}</td>
//           <td>{grade.music}</td>
//           <td>{grade.pe}</td>
//           <td>
//             <EditButton onClick={() => setIsEditing(true)}>✏️</EditButton>
//             <EditButton onClick={() => onDelete(grade.id)}>🗑️</EditButton>
//           </td>
//         </>
//       )}
//     </tr>
//   );
// };
