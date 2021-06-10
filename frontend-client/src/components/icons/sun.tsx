import * as React from 'react';
import { SvgIcon, SvgIconProps } from '@material-ui/core';

const Sun: React.FunctionComponent<SvgIconProps> = (props) => (
  <SvgIcon {...props}>
    <rect x='5.77' y='6.1' width='12.46' height='12.46' fill='#fff' />
    <path d='M23,12.79,18.7,14.92l1.51,4.53a.78.78,0,0,1-1,1l-4.53-1.51-2.14,4.28a.79.79,0,0,1-1.4,0L9,18.93,4.48,20.44a.78.78,0,0,1-1-1L5,14.92.73,12.78a.78.78,0,0,1,0-1.4L5,9.24,3.49,4.71a.79.79,0,0,1,1-1L9,5.23,11.16,1a.77.77,0,0,1,1.39,0L14.7,5.24l4.53-1.52a.79.79,0,0,1,1,1L18.7,9.25,23,11.38A.79.79,0,0,1,23,12.79ZM15.94,8a5.78,5.78,0,1,0,0,8.17A5.77,5.77,0,0,0,15.94,8Zm.25,4.08a4.34,4.34,0,1,1-4.34-4.33A4.35,4.35,0,0,1,16.19,12.08Z' />
  </SvgIcon>
);

export default Sun;
