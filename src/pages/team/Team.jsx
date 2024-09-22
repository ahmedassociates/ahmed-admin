import { AiFillDelete } from 'react-icons/ai';
import { MdModeEditOutline } from 'react-icons/md';
import './Team.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosReq } from '../../utils/axiosReq';
import Modal from 'react-modal';
import { useState } from 'react';
import { deleteImage } from '../../utils/upload';
import { toast } from 'react-toastify';

const Team = () => {
  const { isLoading, error, data: team } = useQuery({
    queryKey: ['teamAlls'],
    queryFn: () => axiosReq.get('/team').then(res => res.data),
  });

  Modal.setAppElement('#root');
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTeamId, setDeleteTeamId] = useState(null);
  const [imgId, setImgId] = useState(null);
  const mutation = useMutation({
    mutationFn: (id) => axiosReq.delete(`/team/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['teamAlls']);
      toast.success('Team Member Removed!');
    },
  });
  const navigate = useNavigate();

  const openDeleteModal = (id, imgId) => {
    setDeleteTeamId(id);
    setImgId(imgId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    closeDeleteModal();
    mutation.mutate(deleteTeamId);
    if (imgId) await deleteImage(imgId);
  };

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
    <div className="team-section">
      <Link to='/team/add' className="create-btn">+ Add Team Member</Link>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Something went wrong!</p>
      ) : team.length === 0 ? (
        <h2 className="empty-message">No Team Members Available</h2>
      ) : (
        team.map((t) => (
          <div key={t._id} className="team-card">
            <div className="team-info">
              <img src={t.img || '/noavatar.png'} alt="team" className="team-img" />
              <div className="team-details">
                <h4>{t.name}</h4>
                <span>{t.title}</span>
                <div style={{ color: 'gray' }}>
                  <b >Added:</b> {new Date(t.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
            <div className="team-actions">
              <button onClick={() => openDeleteModal(t._id, t?.imgId)} className="action-btn delete-btn">
                <AiFillDelete size={24} />
              </button>
              <button onClick={() => navigate(`/team/edit/${t._id}`)} className="action-btn edit-btn">
                <MdModeEditOutline size={24} />
              </button>
            </div>
          </div>
        ))
      )}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Remove Confirmation"
        style={customStyles}
      >
        <h2 className="modal-h2">Delete Confirmation</h2>
        <p className="modal-p">Are you sure you want to remove this team member?</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={closeDeleteModal}>Cancel</button>
          <button className="modal-delete" onClick={confirmDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default Team;
