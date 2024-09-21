import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreatePractice.scss'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreatePractice = () => {
  const [value, setValue] = useState('');
  const [title, setTitle] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);


  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (createPractice) => axiosReq.post('/practice/', createPractice),
    onSuccess: () => {
      queryClient.invalidateQueries(['createPractice']);
      setCreateSuccess(true);
      toast.success('Practice Area Created Successfully!');
    },
    onError: (err) => console.log(err.response.data)
  })
  const navigate = useNavigate();
  if(createSuccess){
      navigate('/practice')
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
    <div className="editPractice">
        <div className="wrapper">
          <input type="text" value={title} placeholder='About Title' onChange={(e) => setTitle(e.target.value)} />
          <div className="editor">
            <ReactQuill theme="snow" modules={toolbarOptions} placeholder='Details About' value={value} onChange={setValue} />
          </div>
          <button className='blog-btn' onClick={createHandler}>CREATE</button>
        </div>
      }
    </div>
  )
}

export default CreatePractice;