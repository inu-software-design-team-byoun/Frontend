import styled from "styled-components";

export const NotiPopOver = styled.span<{ $visible: boolean }>`
  position: absolute;
  /* bottom: 150%; */
  top: 200%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding: 0.75rem 1.5rem;

  // span이라 width, height가 자동으로 조절됨
  white-space: nowrap; // 줄바꿈 X
  display: inline-block;
  font-size: 1.25rem;
  color: black;

  border-radius: 1.25rem;
  filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25));

  z-index: 1;

  &::after {
    content: ""; /* 가상 요소가 보이게 함 */
    position: absolute;
    /* bottom: -0.9rem; // 삼각형이 아래쪽에 위치하도록 설정. 얼마나 떨어질 것인지 */
    top: -0.9rem;
    left: 50%;
    transform: translateX(-50%);

    width: 0;
    height: 0;
    border-left: 0.625rem solid transparent;
    border-right: 0.625rem solid transparent;
    border-bottom: 1rem solid white; /* 삼각형 위쪽 border를 배경색과 동일하게 지정 */
    /* filter: drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25)); */

    z-index: 2;
  }

  visibility: ${(props) => (props.$visible ? "visible" : "hidden")};

  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition:
    opacity 0.2s ease-in-out,
    visibility 0.2s ease-in-out; /* 등장 + 사라짐 애니메이션 */
`;
