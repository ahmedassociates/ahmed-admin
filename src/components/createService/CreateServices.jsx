import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateServices.scss';
import { MdFileUpload } from 'react-icons/md';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { uploadImage } from '../../utils/upload';
import { useEffect } from 'react';

const CreateServices = () => {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [img, setImg] = useState('');
  const [file, setFile] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errmsg, setErrmsg] = useState('')

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.post('/legalServices', input),
    onSuccess: () => {
      queryClient.invalidateQueries(['legalServices create']);
      setCreateSuccess(true);
      toast.success('Created Successfully!');
    },
    onError: (err) => setErrmsg(err.response.data)
  });

  const handlePost = async (e) => {
    e.preventDefault();
    if (title && value) {
      setLoading(true)
      if (file) {
        const {public_id, secure_url} = await uploadImage(file);
        mutation.mutate({imgId: public_id, img: secure_url, title, body: value });
      } else {
        mutation.mutate({ title, body: value });
      }
      setLoading(false)
    };
  }

  const navigate = useNavigate();
  useEffect(() => {
    if (createSuccess) {
      navigate('/services');
    }
  }, [createSuccess])


  const handleImgChange = async (e) => {
    const file = e.target.files[0];
    setFile(file);
    setImg(URL.createObjectURL(file));
  };

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
        <div className="upload-img">
          <label htmlFor="file"><MdFileUpload /></label>
          {img && <img src={img} alt="Upload Image" />}
        </div>
        <input type="file" className="file" hidden name="" id="file" onChange={handleImgChange} />
        <input required type="text" placeholder="Title" onChange={e => setTitle(e.target.value)} />
        <div className="editor">
          <ReactQuill modules={toolbarOptions} theme="snow" placeholder="Descriptions" value={value} onChange={setValue} required={true} />
        </div>
        <button disabled={loading} type='submit' className="blog-btn">
          {loading ? 'Loading...' : 'Add'}
        </button>
        <p style={{color: 'red'}}>{errmsg}</p>
      </form>
    </div>
  );
};

export default CreateServices;
