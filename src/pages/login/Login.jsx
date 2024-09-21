import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { axiosReq } from '../../utils/axiosReq';
import {toast} from 'react-toastify'
import { useDispatch } from 'react-redux';
import { setAdmin } from '../../redux/authSlice';

const Login = () => {
  const [input, setInput] = useState({});
  const [errmsg, setErrmsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const dispatch = useDispatch();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post('/auth/login', input),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['login']);
      toast.success('Login Success!')
      setSuccess(true);
      setErrmsg('');
      dispatch(setAdmin(res.data._id));
    },
    onError: (err) => setErrmsg(err.response.data)
  });

  const navigate = useNavigate();
  useEffect(() => {
   if(success) navigate('/')
  }, [success])

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(input);
  }

  return (
    <div className="login">
      <form className="wrapper" onSubmit={handleSubmit}>
        <h2>Dashboard Login</h2>
        <input onChange={handleChange} name='email' type="email" required placeholder='Email' />
        <input onChange={handleChange} name='password' type="password" required placeholder='Password' />
        <button type='submit'>{mutation.isLoading ? 'Login in..' : 'Login'}</button>
        {<p style={{color: 'red', display: errmsg ? 'block' : 'hidden'}}>{errmsg}</p>}
      </form>
    </div>
  )
}

export default Login