import {
    LogOutIcon,
    BookOpen,
    Calendar,
    Home,
    Menu,
    Pen,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import axios from 'axios';
import { toast } from 'sonner';
const Navbar = () => {
    const navigate = useNavigate();

    async function logoutUser() {
        try {
            const { data } = await axios.post('/api/auth/logout');
            if (data.ok)
                toast.success('logged out', {
                    position: 'top-center',
                });
            else
                toast.error(data.message, {
                    position: 'top-center',
                });
            navigate('/login', { replace: true });
        } catch (e) {
            toast.error('Internal server error', {
                position: 'top-center',
            });
            console.log(e);
        }
    }
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="w-full sticky top-0 bg-card">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    className={'text-xl text-primary font-extrabold'}
                    to={'/'}
                >
                    Attendance Tracker
                </Link>
                <div
                    className={
                        'md:hidden flex gap-5 justify-center items-center'
                    }
                >
                    <ThemeToggleButton />
                    <DropdownMenu
                        open={isMenuOpen}
                        onOpenChange={setIsMenuOpen}
                    >
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {isMenuOpen ? <X /> : <Menu />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => navigate('/dashboard')}
                            >
                                <Home />
                                Dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/subjects')}
                            >
                                <BookOpen />
                                Subjects
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/timetable')}
                            >
                                <Calendar />
                                Timetable
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/manualupdate')}
                            >
                                <Pen />
                                Manual Update
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={logoutUser}
                                variant="destructive"
                            >
                                <LogOutIcon />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div
                    className={
                        'hidden md:flex flex-row justify-center items-center gap-3'
                    }
                >
                    <Button onClick={() => navigate('/')} variant={'ghost'}>
                        <Home />
                        Dashboard
                    </Button>
                    <Button
                        onClick={() => navigate('/subjects')}
                        variant={'ghost'}
                    >
                        <BookOpen />
                        Subjects
                    </Button>
                    <Button
                        onClick={() => navigate('/timetable')}
                        variant={'ghost'}
                    >
                        <Calendar />
                        Timetable
                    </Button>
                    <Button
                        onClick={() => navigate('/manualupdate')}
                        variant={'ghost'}
                    >
                        <Pen />
                        Manual Update
                    </Button>
                </div>
                <div className="hidden md:flex gap-1 justify-center items-center">
                    <ThemeToggleButton />
                    <Button onClick={logoutUser} variant="destructive">
                        <LogOutIcon /> Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
