import styled from 'styled-components';
import css from '@styled-system/css';

interface QRCodeProps {
  qrcode: string;
}

export const QRCode = styled('div')<QRCodeProps>((props) => {
  const { qrcode } = props;
  return css({
    height: 100,
    width: 100,
    backgroundImage: `url(${qrcode})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  });
});
