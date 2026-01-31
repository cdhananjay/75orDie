import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import RegisterPage from '@/pages/RegisterPage';
import SubjectsPage from '@/pages/SubjectsPage';
import TimetablePage from '@/pages/TimetablePage';
import ManualUpdatePage from '@/pages/ManualUpdatePage';
import ProtectedRoutes from '@/lib/ProtectedRoutes';
import Layout from '@/lib/Layout'; // New component, defined below

function App() {
    return (
        <div>
            <Routes>
                <Route path={'/login'} element={<LoginPage />} />
                <Route path={'/register'} element={<RegisterPage />} />
                <Route element={<ProtectedRoutes />}>
                    <Route element={<Layout />}>
                        <Route path={'/'} element={<DashboardPage />} />
                        <Route path={'/subjects'} element={<SubjectsPage />} />
                        <Route
                            path={'/timetable'}
                            element={<TimetablePage />}
                        />
                        <Route
                            path={'/manualupdate'}
                            element={<ManualUpdatePage />}
                        />
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}
export default App;
