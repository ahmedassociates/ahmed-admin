import { Link, useLocation } from 'react-router-dom';
import { AiFillHome } from 'react-icons/ai';
import { FaRegNewspaper } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import { RiTeamFill, RiGalleryFill } from 'react-icons/ri';
import { MdOutlineCollectionsBookmark } from 'react-icons/md';
import { FcAbout } from 'react-icons/fc';
import './Sidebar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { setNavStatus } from '../../redux/navslice';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { navStatus: nav } = useSelector(state => state.nav);
  const dispatch = useDispatch();

  return (
    <div className='sidebar'>
      <div className="list">
        <Link to='/' className={`list-item ${pathname === '/' ? 'active' : ''}`} onClick={() => dispatch(setNavStatus(!nav))}><AiFillHome /> Dashboard</Link>
        <Link to='/about' className={`list-item ${pathname === '/about' ? 'active' : ''}`} onClick={() => dispatch(setNavStatus(!nav))}><FcAbout /> About</Link>
        <Link to='/services' className={`list-item ${pathname === '/services' ? 'active' : ''}`} onClick={() => dispatch(setNavStatus(!nav))}><MdOutlineCollectionsBookmark />Services</Link>
        <Link to='/blog' className={`list-item ${pathname === '/blog' ? 'active' : ''}`} onClick={() => dispatch(setNavStatus(!nav))}><FaRegNewspaper /> Blog</Link>
        <Link to='/news' className={`list-item ${pathname === '/news' ? 'active' : ''}`} onClick={() => dispatch(setNavStatus(!nav))}><FaRegNewspaper /> News</Link>
        <Link to='/job' className={`list-item ${pathname === '/job' ? 'active' : ''}`} onClick={() => dispatch(setNavStatus(!nav))}><MdWork /> Job</Link>
        <Link to='/team' className={`list-item ${pathname === '/team' ? 'active' : ''}`} onClick={() => dispatch(setNavStatus(!nav))}><RiTeamFill /> Team</Link>
        <Link to='/gallery' className={`list-item ${pathname === '/gallery' ? 'active' : ''}`} onClick={() => dispatch(setNavStatus(!nav))}><RiGalleryFill /> Gallery</Link>
      </div>
    </div>
  )
}

export default Sidebar