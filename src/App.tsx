import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Explore from "@/pages/Explore";
import Create from "@/pages/Create";
import Admin from "@/pages/admin/Admin";
import PrivateRoute from "@/components/PrivateRoute";
import AdminRoute from "@/components/AdminRoute";
import CulturalKnowledge from "@/pages/CulturalKnowledge";
import WorksDetail from "@/pages/WorksDetail";
import SocialFeed from "@/pages/SocialFeed";
import UserRelationships from "@/pages/UserRelationships";
import Works from "@/pages/Works";

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/explore" element={<Explore />} />
        
        {/* 需要登录的路由 */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/create" 
          element={
            <PrivateRoute>
              <Create />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/knowledge" 
          element={
            <PrivateRoute>
              <CulturalKnowledge />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/knowledge/:type/:id" 
          element={
            <PrivateRoute>
              <CulturalKnowledge />
            </PrivateRoute>
          } 
        />
        
        {/* 作品详情页面 */}
        <Route 
          path="/works" 
          element={
            <PrivateRoute>
              <Works />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/works/:id" 
          element={
            <PrivateRoute>
              <WorksDetail />
            </PrivateRoute>
          } 
        />
        
        {/* 社交功能路由 */}
        <Route 
          path="/social" 
          element={
            <PrivateRoute>
              <SocialFeed />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/user-relationships/:type" 
          element={
            <PrivateRoute>
              <UserRelationships />
            </PrivateRoute>
          } 
        />
        
        {/* 管理员路由 */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } 
        />
      </Routes>
  );
}
