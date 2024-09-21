import { AiFillDelete } from 'react-icons/ai'
import './News.scss';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axiosReq } from '../../utils/axiosReq';
import { toast } from 'react-toastify';
import Modal from 'react-modal';
import { useState } from 'react';
import { deleteImage } from '../../utils/upload';

const News = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['news'],
    queryFn: () => axiosReq.get('/news').then(res => res.data)
  });

  Modal.setAppElement('#root')
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteNewsId, setDeleteNewsId] = useState(null);
  const [imgId, setImgId] = useState(null);

  const mutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['news']);
      toast.success('News Deleted Successfully!')
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
    setDeleteNewsId(id);
    setImgId(imgId)
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    closeDeleteModal();
    mutation.mutate(deleteNewsId);
    if (imgId) await deleteImage(imgId);
  };

  return (
    <div className="news-section">
      <Link to='/news/create' className="creat">Create News</Link>
      {
        isLoading ? 'Loading..' : error ? 'Something went wrong!' :
          data.length === 0 ? <h2 style={{ padding: '5rem', color: 'gray' }}>News Empty.</h2> :
            data.map((d, i) => (
              <div key={i} className="news">
                <div className="img-title">
                  {/* <img src={d.img || '/defaultBlog.jpg'} alt="" /> */}
                  <h4>{d.title.substring(0, 50)}</h4>
                  <span>{new Date(d.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}</span>
                </div>
                <div className="btn">
                  <Link to={`/news/${d._id}`} className="edit">EDIT</Link>
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
        <p className='modal-p'>Are you sure you want to Delete this News?</p>
        <div>
          <button className='modal-cancel' onClick={closeDeleteModal}>Cancel</button>
          <button className='modal-delete' onClick={confirmDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}

export default News