import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditServices.scss'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdFileUpload } from 'react-icons/md';
import { uploadImage } from '../../utils/upload';

const EditServices = () => {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState('')
  const [img, setImg] = useState('');
  const [loading, setLoading] = useState(false)

  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ['single-services'],
    queryFn: () => axiosReq.get(`/legalServices/${id}`).then(res => res.data)
  });

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setValue(data.body);
      setImg(data.img)
    }
  }, [data]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedBlog) => axiosReq.put(`/legalServices/${id}`, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries(['single-services']);
      setUpdateSuccess(true);
      toast.success('Updated Successfully!');
    },
    onError: (err) => console.log(err.response.data)
  })
  const navigate = useNavigate();
  if (updateSuccess) {
    navigate('/services')
  }
  const updateHandler = async () => {
    setLoading(true)
    if (file) {
      const { public_id, secure_url } = await uploadImage(file);
      mutation.mutate({ img: secure_url, imgId: public_id, title, body: value })
    } else {
      mutation.mutate({ title, body: value });
    }
    setLoading(false)
  }

  const handleImgChange = (e) => {
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
      ['link', 'image', 'video'],
      ['clean'], // Remove formatting option
    ],
  };

  return (
    <div className="editBlog">
      {isLoading ? 'Loading..' : error ? 'Something went wrong!' :
        !data ? <h2 style={{ padding: '5rem', color: 'gray' }}>Services Not Found!</h2> :
          <div className="wrapper">
            <div className="upload-img">
              <label htmlFor="file"><MdFileUpload /></label>
              <img src={img || imgUrl} alt="image" />
            </div>
            <input type="file" className='file' hidden name="" id="file" onChange={handleImgChange} />
            {data.title && <input type="text" value={title} placeholder='Title' onChange={(e) => setTitle(e.target.value)} />}
            <div className="editor">
              {value && <ReactQuill theme="snow" modules={toolbarOptions} placeholder='Descriptions' value={value} onChange={setValue} />}
            </div>
            <button disabled={loading || isLoading} className='blog-btn' onClick={updateHandler}>{loading || isLoading ? 'Loading..' : 'Update'}</button>
            {/* {successmsg && <p className='successMsg'>{successmsg}</p>} */}
          </div>
      }
    </div>
  )
}

export default EditServices;