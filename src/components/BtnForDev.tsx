import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const TransparentButton = styled.button`
  /* border: 2px solid black; */
  border: none;
  position: absolute;
  top: 0;
  left: 0;

  width: 5rem;
  height: 5rem;

  background-color: transparent;
`;
interface BtnForDevProps {
  link: string;
}

export const BtnForDev: React.FC<BtnForDevProps> = ({ link }) => {
  const navigate = useNavigate();

  const goToLink = () => {
    navigate(link);
  };

  return (
    <>
      <TransparentButton onClick={goToLink} />
    </>
  );
};
