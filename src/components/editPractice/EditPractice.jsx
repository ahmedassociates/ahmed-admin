import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditPractice.scss'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditPractice = () => {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { id } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ['practice'],
    queryFn: () => axiosReq.get(`/practice/${id}`).then(res => res.data)
  });

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setValue(data.body);
    }
  }, [data]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedPractice) => axiosReq.put(`/practice/${id}`, updatedPractice),
    onSuccess: () => {
      queryClient.invalidateQueries(['practice']);
      setUpdateSuccess(true);
      toast.success('Practice Area Updated Successfully!');
    },
    onError: (err) => console.log(err.response.data)
  })
  const navigate = useNavigate();
  if(updateSuccess){
      navigate('/practice')
  }
  const updateHandler = () => {
    mutation.mutate({ title, body: value });
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
      ['link', 'image','video'],
      ['clean'], // Remove formatting option
    ],
  };

  return (
    <div className="editPractice">
      {isLoading ? 'Loading..' : error ? 'Something went wrong!' :
      !data ? <h2 style={{ padding: '5rem', color: 'gray' }}>Practice Area Not Found!</h2> :
        <div className="wrapper">
          <input type="text" value={title} placeholder='Practice Area Title' onChange={(e) => setTitle(e.target.value)} />
          <div className="editor">
            {value && <ReactQuill theme="snow" modules={toolbarOptions} placeholder='Practice area details' value={value} onChange={setValue} />}
          </div>
          <button className='blog-btn' onClick={updateHandler}>UPDATE</button>
          {/* {successmsg && <p className='successMsg'>{successmsg}</p>} */}
        </div>
      }
    </div>
  )
}

export default EditPractice;