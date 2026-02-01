import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { toast } from 'sonner';
import Footer from '@/components/Footer';

const LoginPage = () => {
    const nav = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    async function submitForm(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/login', {
                username,
                password,
            });
            if (data.ok) return nav('/');
            toast.error(data.message, { position: 'bottom-center' });
            nav('/');
        } catch (e) {
            toast.error('Client side error, check browser logs for details.', {
                position: 'bottom-center',
            });
            console.error(e);
        }
    }
    return (
        <div className={'flex flex-col items-center justify-center min-h-screen'}>
            <main className={'flex flex-col justify-center items-center gap-10'}>
                <div className='fixed top-4 right-4'>
                    <ThemeToggleButton />
                </div>
                <div className={'flex gap-5 flex-col justify-center items-center'}>
                    <h1 className={'text-6xl text-primary font-extrabold'}>
                        75or<span className={'text-red-500'}>Die</span>
                    </h1>
                    <p className={'text-center text-muted-foreground'}>
                        Stop guessing if you're safe. Start tracking.
                    </p>
                </div>
                <Card className='w-full max-w-sm'>
                    <CardHeader>
                        <CardTitle>Login to your account</CardTitle>
                        <CardDescription>
                            Enter your username below to login to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form>
                            <div className='flex flex-col gap-6'>
                                <div className='grid gap-2'>
                                    <Label htmlFor='username'>Username</Label>
                                    <Input
                                        onChange={(e) => setUsername(e.target.value)}
                                        id='username'
                                        type='text'
                                        required
                                    />
                                </div>
                                <div className='grid gap-2'>
                                    <div className='flex items-center'>
                                        <Label htmlFor='password'>Password</Label>
                                    </div>
                                    <Input
                                        onChange={(e) => setPassword(e.target.value)}
                                        id='password'
                                        type='password'
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className='flex-col gap-2'>
                        <Button onClick={(e) => submitForm(e)} type='submit' className='w-full'>
                            Login
                        </Button>
                        <p className={'flex text-sm gap-1 items-center'}>
                            New User?
                            <Link
                                to='/register'
                                className='text-primary inline-block text-sm underline-offset-4 hover:underline'
                            >
                                Register Instead
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </main>
            <div className={'fixed bottom-0 right-0 left-0'}>
                <Footer />
            </div>
        </div>
    );
};

export default LoginPage;
