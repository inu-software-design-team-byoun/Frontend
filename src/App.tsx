import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import ScorePage from "./pages/ScorePage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <ScorePage />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
