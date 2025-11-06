import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Profil from "./pages/Profil";
import Seances from "./pages/Seances";
import Add from "./pages/Add";
import MusculationExercices from "./pages/MusculationExercices";
import YogaExercices from "./pages/YogaExercices";
import MobilityExercices from "./pages/MobilityExercices";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <>
      <div className="max-w-[80vw] max-h-[80vw] bg-gray-500 mx-auto">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seances"
            element={
              <ProtectedRoute>
                <Seances />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <Profil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <Add />
              </ProtectedRoute>
            }
          />
          <Route
            path="/musculationExercices"
            element={
              <ProtectedRoute>
                <MusculationExercices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/yogaExercices"
            element={
              <ProtectedRoute>
                <YogaExercices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mobilityExercices"
            element={
              <ProtectedRoute>
                <MobilityExercices />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <div className="max-w-[80vw] max-h-[80vw] bg-gray-500 mx-auto">
        <NavBar />
      </div>
    </>
  );
};

export default App;
