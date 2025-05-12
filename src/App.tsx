import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import ScorePage from "./pages/ScorePage";
import { LoginPage } from "./pages/LoginPage";
import AuthLayout from "./layouts/AuthLayout";
import AttendancePage from "./pages/AttendancePage";
import ScoreInputPage from "./pages/ScoreInputPage";

import CounselPage from "./pages/CounselPage";

import { AddinfoPage } from "./pages/AddinfoPage";

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
        <Route
          path="/attendance"
          element={
            <MainLayout>
              <AttendancePage />
            </MainLayout>
          }
        />
        <Route
          path="/counsel"
          element={
            <MainLayout>
              <CounselPage />
            </MainLayout>
          }
        />
        <Route
          path="/scoreinput"
          element={
            <MainLayout>
              <ScoreInputPage />
            </MainLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/addinfo"
          element={
            <AuthLayout>
              <AddinfoPage />
            </AuthLayout>
          }
        />
      </Routes>
    </Router>
  );
};
export default App;
