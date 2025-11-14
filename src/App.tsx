import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Explore = lazy(() => import("@/pages/Explore"));
const Create = lazy(() => import("@/pages/Create"));
import PrivateRoute from "@/components/PrivateRoute";
import AdminRoute from "@/components/AdminRoute";
const CulturalKnowledge = lazy(() => import("@/pages/CulturalKnowledge"));
const WorksDetail = lazy(() => import("@/pages/WorksDetail"));
const SocialFeed = lazy(() => import("@/pages/SocialFeed"));
const UserRelationships = lazy(() => import("@/pages/UserRelationships"));
const Works = lazy(() => import("@/pages/Works"));

const Admin = lazy(() => import("@/pages/admin/Admin"));

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
              <Suspense fallback={<div style={{padding:16}}>加载中...</div>}>
                <Dashboard />
              </Suspense>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/create" 
          element={
            <PrivateRoute>
              <Suspense fallback={<div style={{padding:16}}>加载中...</div>}>
                <Create />
              </Suspense>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/knowledge" 
          element={
            <PrivateRoute>
              <Suspense fallback={<div style={{padding:16}}>加载中...</div>}>
                <CulturalKnowledge />
              </Suspense>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/knowledge/:type/:id" 
          element={
            <PrivateRoute>
              <Suspense fallback={<div style={{padding:16}}>加载中...</div>}>
                <CulturalKnowledge />
              </Suspense>
            </PrivateRoute>
          } 
        />
        
        {/* 作品详情页面 */}
        <Route 
          path="/works" 
          element={
            <PrivateRoute>
              <Suspense fallback={<div style={{padding:16}}>加载中...</div>}>
                <Works />
              </Suspense>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/works/:id" 
          element={
            <PrivateRoute>
              <Suspense fallback={<div style={{padding:16}}>加载中...</div>}>
                <WorksDetail />
              </Suspense>
            </PrivateRoute>
          } 
        />
        
        {/* 社交功能路由 */}
        <Route 
          path="/social" 
          element={
            <PrivateRoute>
              <Suspense fallback={<div style={{padding:16}}>加载中...</div>}>
                <SocialFeed />
              </Suspense>
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/user-relationships/:type" 
          element={
            <PrivateRoute>
              <Suspense fallback={<div style={{padding:16}}>加载中...</div>}>
                <UserRelationships />
              </Suspense>
            </PrivateRoute>
          } 
        />
        
        {/* 管理员路由 */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <Suspense fallback={<div style={{padding:16}}>加载中...</div>}>
                <Admin />
              </Suspense>
            </AdminRoute>
          } 
        />
      </Routes>
  );
}
