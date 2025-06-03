import { styled } from "styled-components";

export const CrudButton = styled.button<{
  $bgColor: string;
  width?: string;
  $isEditing?: boolean;
}>`
  border: none;
  border-radius: 0.5rem;

  margin-left: 0.75rem;
  width: ${(props) => (props.width ? props.width : "4rem")};
  height: 2rem;

  /* background-color: #86acff; */
  // isEditing props를 전달해주지 않은 버튼은 $bgColor로 전달받은 색이 그냥 나오고
  // isEditing props를 전달받은 버튼은 조건에 따라 색상 변경
  background-color: ${(props) =>
    props.$isEditing ? "#86acff" : props.$bgColor};
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;
  color: white;

  cursor: pointer;

  // 마우스를 올릴 때는 바로 바뀌고 뗄 때는 천천히 바뀌게 구현
  // 1. 마우스 올릴 때
  &:hover:enabled {
    color: ${(props) => props.$bgColor};
    background-color: white;
    border: 1.5px solid ${(props) => props.$bgColor};
  }

  // 2. 마우스 뗄 떼
  &:not(:hover) {
    transition: // border는 바로 바뀌는 게 더 자연스러운 듯
      background-color 0.2s ease-in-out,
      color 0.2s ease-in-out;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    /* hover:enabled 가 아닌 상태에서는 hover 규칙이 절대 적용되지 않음 */
  }
`;
