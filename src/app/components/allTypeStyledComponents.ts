import StyledComponentProps from '@/types/styled-components-type';
import styled from 'styled-components/macro';

export const Drawer = styled.div<StyledComponentProps>`
  height: 100%;
`;

export const NewIcon = styled.img<StyledComponentProps>`
  height: ${props => (props.height ? props.height : 'auto')} !important;
`;

export const NewVideo = styled.video<StyledComponentProps>`
  top: ${props => (props.top ? props.top : '0')};
`;

export const Modal = styled.div<StyledComponentProps>`
  z-index: ${props => props.zindex || '1'};
`;

export const Row = styled.div<StyledComponentProps>`
  display: flex;
`;

export const Col = styled.div`
  display: flex;
`;

export const NewP = styled.p<StyledComponentProps>`
  letter-spacing: 0;
`;
