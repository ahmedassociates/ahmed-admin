import { useEffect, useState } from 'react'
import './TeamEdit.scss'
import { MdFileUpload } from 'react-icons/md'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import { toast } from 'react-toastify';
import { uploadImage } from '../../utils/upload';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';

const TeamEdit = () => {
  const [img, setImg] = useState('');
  const [errmsg, setErrmsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [input, setInput] = useState({});
  const [value, setValue] = useState('')
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState('')

  const { id } = useParams()

  const { isLoading, error, data } = useQuery({
    queryKey: ['teamAll'],
    queryFn: () => axiosReq.get(`/team/${id}`).then(res => res.data)
  });

  useEffect(() => {
    if (data) {
      setInput({name: data.name, title: data.title, phone: data.phone, email: data.email, location: data.location});
      setValue(data.desc);
      setImgUrl(data.img)
    }
  }, [data]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input) => axiosReq.put(`/team/${id}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries(['team']);
      toast.success('Update Successfully!');
      setSuccess(true);
      setInput({});
    },
    onError: (err) => setErrmsg(err.response.data)
  });

  const navigate = useNavigate()

  useEffect(() => {
    if (success) navigate('/team')
  }, [success])

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setImg(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (file) {
      const { public_id, secure_url } = await uploadImage(file);
      mutation.mutate({ img: secure_url, imgId: public_id, ...input, desc: value })
    } else {
      mutation.mutate({ ...input, desc: value })
    }
    setLoading(false)
  }

  const toolbarOptions = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // Indentation options
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['link', 'image', 'video'],
      ['clean'], // Remove formatting option
    ],
  };
  return (
    <div className="team-add">
      <form className='team-form' onSubmit={handleUpload}>
        <div className="upload-img">
          <label htmlFor="file"><MdFileUpload /></label>
          <img src={img || imgUrl} alt="image" />
        </div>
        <input type="file" className='file' hidden name="" id="file" onChange={handleImgChange} />
        <input onChange={handleChange} value={input.name} required name='name' type="text" placeholder='Name' />
        <input onChange={handleChange} value={input.title} required name='title' type="text" placeholder='Title e.g:family lawer' />
        <input onChange={handleChange} value={input.phone} name='phone' type="text" placeholder='Phone' />
        <input onChange={handleChange} value={input.email} name='email' type="text" placeholder='Email' />
        <input onChange={handleChange} value={input.location} name='location' type="text" placeholder='Location' />
        <div className="team-editor">
          <ReactQuill modules={toolbarOptions} theme="snow" placeholder="Descriptions" value={value} onChange={setValue} required={true} />
        </div>
        <button disabled={loading} className='btn' type='submit'>{loading ? 'Loading..' : 'UPDATE'}</button>
        <p style={{ color: 'red' }}>{errmsg}</p>
      </form>
    </div>
  )
}

export default TeamEdit