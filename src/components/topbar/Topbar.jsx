import { useEffect, useState } from 'react';
import './Topbar.scss';
import { FiLogOut } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux';
import { setNavStatus } from '../../redux/navslice';
import { clearAdmin } from '../../redux/authSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import { toast } from 'react-toastify';

const Topbar = () => {
  const {navStatus: nav} = useSelector(state => state.nav);
  const dispatch = useDispatch();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => axiosReq.post('/auth/logout'),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['logout']);
      toast.success(res.data);
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosReq.get('/auth/verify');
      } catch (error) {
        if(error.response.status === 403) {
          return dispatch(clearAdmin());
        }
      }
    }
    checkAuth();
  }, [])

  const handleLogout = () => {
    dispatch(clearAdmin());
    mutation.mutate();
  };
  return (
    <div className="topbar">
      <img src="/ahmed.png" alt="" />
      <div className={`logout ${!nav? 'active' : ''}`}>
        <FiLogOut />
        <span onClick={handleLogout}>Logout</span>
      </div>
      <div className="nav-btn">
        <div className={`nav-btn-line ${nav ? 'active' : ''}`} onClick={() => dispatch(setNavStatus(!nav))}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

export default Topbar