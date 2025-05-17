// NotiPopOver.tsx
import styled from "styled-components";

export const NotiPopOver = styled.div<{ $visible: boolean }>`
  position: absolute;
  top: 200%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;

  width: 320px;
  max-height: 400px;
  overflow: visible;

  display: flex;
  flex-direction: column;
  /* align-items: center; */

  font-size: 1rem;
  color: black;

  border-radius: 1.25rem;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));

  z-index: 1;

  &::after {
    content: ""; /* 가상 요소가 보이게 함 */
    position: absolute;
    /* bottom: -0.9rem; // 삼각형이 아래쪽에 위치하도록 설정. 얼마나 떨어질 것인지 */
    top: -0.9rem; // 삼각형이 위쪽에 위치하도록  설정. 얼마나 떨어질 것인지
    left: 50%;
    transform: translateX(-50%);

    width: 0;
    height: 0;
    border-left: 0.625rem solid transparent;
    border-right: 0.625rem solid transparent;
    border-bottom: 1rem solid white; /* 삼각형 아래쪽 border를 배경색과 동일하게 지정 => 일반 삼각형 모양 완성*/
    /* filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25)); */

    z-index: 10;
  }

  span {
    height: 3.25rem;
    display: flex;
    justify-content: center;
    align-items: center;

    font-weight: bold;
  }

  visibility: ${(props) => (props.$visible ? "visible" : "hidden")};

  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition:
    opacity 0.2s ease-in-out,
    visibility 0.2s ease-in-out; /* 등장 + 사라짐 애니메이션 */
`;
