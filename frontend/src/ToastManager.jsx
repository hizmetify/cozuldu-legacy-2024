import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { clearToast } from '../features/toastSlice';

const ToastManager = () => {
  const { message, type } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      if (type === 'success') toast.success(message);
      if (type === 'error') toast.error(message);
      if (type === 'info') toast(message);

      dispatch(clearToast());
    }
  }, [message, type, dispatch]);

  return null;
};

export default ToastManager;
