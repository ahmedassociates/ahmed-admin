import { AiFillDelete } from 'react-icons/ai'
import './Job.scss';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosReq } from '../../utils/axiosReq';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { useState } from 'react';
import { deleteImage } from '../../utils/upload';

const Job = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['job'],
    queryFn: () => axiosReq.get('/job').then(res => res.data)
  });

  Modal.setAppElement('#root')
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState(null);

  const mutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/job/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['job']);
      toast.success('Job Deleted Successfully!')
    }
  });

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


  const openDeleteModal = (id) => {
    setDeleteJobId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    mutation.mutate(deleteJobId);
    closeDeleteModal();
  };

  return (
    <div className="job-section">
      <Link to='/job/create' className="creat">Create New Job</Link>
      {
        isLoading ? 'Loading..' : error ? 'Something went wrong!' :
          data.length === 0 ? <h2 style={{ padding: '5rem', color: 'gray' }}>Job Empty.</h2> :
            data.map((d, i) => (
              <div key={i} className="job">
                <div className="info">
                  <h4>{d.title.substring(0, 50)}</h4>
                  <span><b>added: </b>{new Date(d.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}</span>
                </div>
                <div className="btn">
                  <Link to={`/job/${d._id}`} className="edit">EDIT</Link>
                  <button className="delete" onClick={() => openDeleteModal(d._id)}><AiFillDelete size={24} /></button>
                </div>
              </div>
            ))
      }
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Delete Confirmation"
        style={customStyles}
      >
        <h2 className='modal-h2'>Delete Confirmation</h2>
        <p className='modal-p'>Are you sure you want to delete this job?</p>
        <div>
          <button className='modal-cancel' onClick={closeDeleteModal}>Cancel</button>
          <button className='modal-delete' onClick={confirmDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}

export default Job;