import { AiFillDelete } from 'react-icons/ai';
import { MdFileUpload } from 'react-icons/md';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import './Gallery.scss';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteImage, uploadImage } from '../../utils/upload';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

const Gallery = () => {
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteGalleryId, setDeleteGalleryId] = useState(null);
  const [imgId, setImgId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false)

  const { isLoading, error, data } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => axiosReq.get('/gallery').then(res => res.data)
  });

  Modal.setAppElement('#root');
  const queryClient = useQueryClient();

  const navitage = useNavigate();
  useEffect(() => {
    if(success) navitage('/gallery')
  }, [success])
  

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['gallery']);
      toast.success('Image Removed!')
    }
  });
  const uploadMutation = useMutation({
    mutationFn: (path) => axiosReq.post('/gallery', path),
    onSuccess: () => {
      queryClient.invalidateQueries(['gallery']);
      toast.success('Image Uploaded Successfully');
      setSuccess(true);
    }
  });

  const openDeleteModal = (id, imgId) => {
    setDeleteGalleryId(id);
    setImgId(imgId)
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    closeDeleteModal();
    deleteMutation.mutate(deleteGalleryId);
    await deleteImage(imgId);
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setImg(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (file) {
      setLoading(true)
      const { public_id, secure_url } = await uploadImage(file);
      uploadMutation.mutate({ image: secure_url, imgId: public_id });
      setFile(null)
      setImg(null)
      setLoading(false)
    }
  }

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

  return (
    <div className="gallery-section">
      <div className="gallery-img">
        <label htmlFor="gallery-image"><MdFileUpload /></label>
        {img && <img src={img} alt="image" />}
      </div>
      <input onChange={handleImgChange} type='file' id='gallery-image' hidden />
      <button disabled={loading} onClick={handleUpload} className="gallery-btn">{loading ? 'Loading..' : 'Upload'}</button>
      <div className="gallery-main">
        {
          isLoading ? 'Loading..' : error ? 'Something went wrong!' :
            data.length === 0 ? <h2 style={{ padding: '5rem', color: 'gray' }}>Gallery Empty.</h2> :
              data.map(g => (
                <div key={g._id} className="gallery">
                  <div className="img">
                    <img src={g.image} alt="" />
                  </div>
                  <div className="info">
                    <span>{new Date(g.createdAt).toLocaleDateString()}</span>
                    <div className="btn">
                      <button onClick={() => openDeleteModal(g._id, g.imgId)} className="delete"><AiFillDelete size={24} /></button>
                    </div>
                  </div>
                </div>
              ))
        }
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Remove Confirmation"
        style={customStyles}
      >
        <h2 className='modal-h2'>Delete Confirmation</h2>
        <p className='modal-p'>Are you sure you want to Remove Team Member?</p>
        <div>
          <button className='modal-cancel' onClick={closeDeleteModal}>Cancel</button>
          <button className='modal-delete' onClick={confirmDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  )
}

export default Gallery