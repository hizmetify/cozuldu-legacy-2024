import { useSelector } from 'react-redux';
import {
  selectLoading,
  selectLoadingFullScreen,
  selectLoadingMessage,
} from '../../features/loading/loadingSlice';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = () => {
  const isLoading = useSelector(selectLoading);
  const message = useSelector(selectLoadingMessage);
  const fullScreen = useSelector(selectLoadingFullScreen);

  if (!isLoading) return null;

  return <LoadingSpinner message={message} fullScreen={fullScreen} />;
};

export default LoadingOverlay;
