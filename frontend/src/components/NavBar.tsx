import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.ts";
import { useAuth } from "../context/useAuth";
import "../index.css";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-row justify-between px-4 py-4 gap-2">
      <button
        onClick={() => navigate("/")}
        className="flex flex-col items-center bg-gray-100 rounded-lg w-full cursor-pointer border-none p-0"
      >
        <img className="w-[30px] py-2 icon-blue" src={assets.Home} alt="" />
        <p>Home</p>
      </button>
      <button
        onClick={() => navigate("/seances")}
        className="flex flex-col items-center bg-gray-100 rounded-lg w-full cursor-pointer border-none p-0"
      >
        <img
          className="w-[30px] py-2 icon-blue"
          src={assets.MesSeances}
          alt=""
        />
        <p>Mes Séances</p>
      </button>
      <button
        onClick={() => navigate("/profil")}
        className="flex flex-col items-center bg-gray-100 rounded-lg w-full cursor-pointer border-none p-0"
      >
        <img className="w-[30px] py-2 icon-blue" src={assets.Profil} alt="" />
        <p>Profil</p>
      </button>
      <button
        onClick={() => navigate("/add")}
        className="flex flex-col items-center bg-gray-100 rounded-lg w-full cursor-pointer border-none p-0"
      >
        <p> + </p>
      </button>
      <div className="flex flex-col items-center bg-gray-100 rounded-lg w-full p-2 gap-2">
        <p className="text-xs text-gray-700 truncate">{user?.username}</p>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1 px-2 rounded transition duration-200"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default NavBar;
