import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './JobInput.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const JobInput = () => {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errmsg, setErrmsg] = useState('')

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post('/job', input),
    onSuccess: () => {
      queryClient.invalidateQueries(['job']);
      setCreateSuccess(true);
      toast.success('Job Created Successfully!');
    },
    onError: (err) => setErrmsg(err.response.data)
  });

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (title && value) {
        mutation.mutate({ title, body: value });
      }
      setLoading(false)
  }

  const navigate = useNavigate();
  useEffect(() => {
    if (createSuccess) {
      navigate('/job');
    }
  }, [createSuccess])

  const toolbarOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // Indentation options
      [{ align: [] }], 
      [{ color: [] }, { background: [] }],
      ['link', 'image','video'],
      ['clean'], // Remove formatting option
    ],
  };
  return (
    <div className="blogInput">
      <form className="wrapper" onSubmit={handlePost}>
        <input required type="text" placeholder="Job Title" onChange={e => setTitle(e.target.value)} />
        <div className="editor">
          <ReactQuill modules={toolbarOptions} theme="snow" placeholder="Job Descriptions" value={value} onChange={setValue} required={true} />
        </div>
        <button disabled={loading} type='submit' className="blog-btn">
          {loading ? 'Loading...' : 'Publish Job'}
        </button>
        <p style={{color: 'red'}}>{errmsg}</p>
      </form>
    </div>
  );
};

export default JobInput;
