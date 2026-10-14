import { Navigate } from 'react-router-dom';
import Chat from '../components/Chat';
import DashboardLayout from '../components/layout/DashboardLayout';
import Favorites from './dashboard/Favorites';
import MyAds from './dashboard/MyAds';
import Profile from './dashboard/Profile';

type DashboardPage = 'ads' | 'profile' | 'favorites' | 'messages';

type DashboardRouteProps = {
  page: DashboardPage;
};

export default function DashboardRoute({ page }: DashboardRouteProps) {
  const user = localStorage.getItem('vi-user');

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const content = {
    ads: <MyAds />,
    profile: <Profile />,
    favorites: <Favorites />,
    messages: <Chat />,
  }[page];

  return <DashboardLayout>{content}</DashboardLayout>;
}
