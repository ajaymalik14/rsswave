
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ArticlesPage from './pages/ArticlesPage';
import FeedsPage from './pages/FeedsPage';
import RadioPage from './pages/RadioPage';
import RadioStationPage from './pages/RadioStationPage';
import ListenPage from './pages/ListenPage';
import AIFetchPage from './pages/AIFetchPage';
import AudioLibraryPage from './pages/AudioLibraryPage';
import ExplorePage from './pages/ExplorePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="articles" element={<ArticlesPage />} />
              <Route path="feeds" element={<FeedsPage />} />
              <Route path="radio" element={<RadioPage />} />
              <Route path="radio/:id" element={<RadioStationPage />} />
              <Route path="listen" element={<ListenPage />} />
              <Route path="ai-fetch" element={<AIFetchPage />} />
              <Route path="audio-library" element={<AudioLibraryPage />} />
              <Route path="explore" element={<ExplorePage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
