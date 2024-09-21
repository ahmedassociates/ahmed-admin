import { AiFillDelete } from 'react-icons/ai'
import './LegalServices.scss';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosReq } from '../../utils/axiosReq';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { useState } from 'react';
import { deleteImage } from '../../utils/upload';

const LegalServices = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['legalServices'],
    queryFn: () => axiosReq.get('/legalServices').then(res => res.data)
  });

  Modal.setAppElement('#root')
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLegalServicesId, setDeleteLegalServicesId] = useState(null);
  const [imgId, setImgId] = useState(null);

  const mutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/legalServices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['legalServices']);
      toast.success('Deleted Successfully!')
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


  const openDeleteModal = (id, imgId) => {
    setDeleteLegalServicesId(id);
    setImgId(imgId)
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    closeDeleteModal();
    mutation.mutate(deleteLegalServicesId);
    if (imgId) await deleteImage(imgId);
  };

  return (
    <div className="blogs-section">
      <Link to='/services/create' className="creat">Create New</Link>
      {
        isLoading ? 'Loading..' : error ? 'Something went wrong!' :
          data.length === 0 ? <h2 style={{ padding: '5rem', color: 'gray' }}>Service Empty.</h2> :
            data.map((d, i) => (
              <div key={i} className="blog">
                <div className="img-title">
                  <img src={d.img} alt="" />
                  <h4>{d.title.substring(0, 50)}</h4>
                  <span>{new Date(d.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}</span>
                </div>
                <div className="btn">
                  <Link to={`/services/${d._id}`} className="edit">EDIT</Link>
                  <button className="delete" onClick={() => openDeleteModal(d._id, d?.imgId)}><AiFillDelete size={24} /></button>
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
        <p className='modal-p'>Are you sure you want to Delete this Blog?</p>
        <div>
          <button className='modal-cancel' onClick={closeDeleteModal}>Cancel</button>
          <button className='modal-delete' onClick={confirmDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}

export default LegalServices