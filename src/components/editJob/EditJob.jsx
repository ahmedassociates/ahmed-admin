import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditJob.scss'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditJob = () => {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { jobId } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ['single-job'],
    queryFn: () => axiosReq.get(`/job/${jobId}`).then(res => res.data)
  });

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setValue(data.body);
    }
  }, [data]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (updatedJob) => axiosReq.put(`/job/${jobId}`, updatedJob),
    onSuccess: () => {
      queryClient.invalidateQueries(['single-job']);
      setUpdateSuccess(true);
      toast.success('Job Updated Successfully!');
    },
    onError: (err) => console.log(err.response.data)
  })
  const navigate = useNavigate();
  if(updateSuccess){
      navigate('/job')
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
    <div className="editJob">
      {isLoading ? 'Loading..' : error ? 'Something went wrong!' :
      !data ? <h2 style={{ padding: '5rem', color: 'gray' }}>No Job Found!</h2> :
        <div className="wrapper">
          {data.title && <input type="text" value={title} placeholder='Blog Title' onChange={(e) => setTitle(e.target.value)} />}
          <div className="editor">
            {value && <ReactQuill modules={toolbarOptions} theme="snow" placeholder='Job Descriptions' value={value} onChange={setValue} />}
          </div>
          <button className='job-btn' onClick={updateHandler}>UPDATE</button>
          {/* {successmsg && <p className='successMsg'>{successmsg}</p>} */}
        </div>
      }
    </div>
  )
}

export default EditJob;