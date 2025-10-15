import { Bookmark, BookOpen, Home, LogOut, Users } from 'react-feather';
import { useHistory } from 'react-router';

import SidemenuBG from '../../assets/sidemenu-bg.jpg';
import LogoWhite from '../../assets/urbano-logo-white.png';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div
      className={[
        // imagen de fondo
        'sidebar bg-cover bg-center bg-no-repeat',
        // color para oscurecer
        'bg-black/60',
        // mezcla para que el color oscurezca la imagen
        'bg-blend-multiply',
        // (opcional) que el texto se vea
        'text-white',
        className,
      ].join(' ')}
      style={{ backgroundImage: `url(${SidemenuBG})` }}
    >
      <div className="flex justify-center">
        <img src={LogoWhite} alt="" />
      </div>
      {/* <h1 className="font-semibold text-center">Carna Project</h1> */}

      <nav className="mt-5 flex flex-col gap-3 flex-grow">
        <SidebarItem to="/">
          <Home /> Dashboard
        </SidebarItem>
        <SidebarItem to="/courses">
          <BookOpen /> Courses
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users">
            <Users /> Users
          </SidebarItem>
        ) : null}
        {authenticatedUser.role === 'user' ? (
          <SidebarItem to="/enrollments">
            <Bookmark /> Enrollments
          </SidebarItem>
        ) : null}
      </nav>
      <button
        className="text-primary-white rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none"
        onClick={handleLogout}
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
