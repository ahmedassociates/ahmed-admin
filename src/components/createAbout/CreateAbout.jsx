import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateAbout.scss'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateAbout = () => {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);


  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (createAbout) => axiosReq.post('/about/', createAbout),
    onSuccess: () => {
      queryClient.invalidateQueries(['createAbout']);
      setCreateSuccess(true);
      toast.success('About Created Successfully!');
    },
    onError: (err) => console.log(err.response.data)
  })
  const navigate = useNavigate();
  if(createSuccess){
      navigate('/about')
  }
  const createHandler = () => {
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
    <div className="editAbout">
        <div className="wrapper">
          <input type="text" value={title} placeholder='About Title' onChange={(e) => setTitle(e.target.value)} />
          <div className="editor">
            <ReactQuill theme="snow" modules={toolbarOptions} placeholder='Details About' value={value} onChange={setValue} />
          </div>
          <button className='blog-btn' onClick={createHandler}>CREATE</button>
          {/* {successmsg && <p className='successMsg'>{successmsg}</p>} */}
        </div>
      }
    </div>
  )
}

export default CreateAbout;