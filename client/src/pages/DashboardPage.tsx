import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
    BookOpenIcon,
    CircleCheckBigIcon,
    TrendingDownIcon,
    TrendingUpIcon,
    XCircleIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import SubjectOverviewCard from '@/components/SubjectOverviewCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';

type subject = {
    name: string;
    classesAttended: number;
    totalClasses: number;
    occurrence: number[];
};

const DashboardPage = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState<subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [classesToday, setClassesToday] = useState<subject[]>([]);
    const [classesAttended, setClassesAttended] = useState(0);
    const [totalClasses, setTotalClasses] = useState(0);
    const getSubjectData = async () => {
        try {
            const { data } = await axios.get('/api/sub/');
            if (data.ok) {
                setSubjects(data.subjects);
                let attended = 0;
                let total = 0;
                let classes: typeof data.subjects = [];
                for (const sub of data.subjects) {
                    for (let i = 0; i < sub.occurrence[new Date().getDay()]; i++) classes.push(sub);
                    attended += sub.classesAttended;
                    total += sub.totalClasses;
                }
                setClassesToday(classes);
                setClassesAttended(attended);
                setTotalClasses(total);
            }
        } catch (e) {
            toast.error('Client side error, check browser logs for details.', {
                position: 'bottom-center',
            });
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getSubjectData();
    }, []);
    async function markAll(present: boolean) {
        setLoading(true);
        try {
            for (const sub of classesToday) {
                sub.totalClasses++;
                if (present) sub.classesAttended++;
                const { data } = await axios.patch('/api/sub', {
                    subjectName: sub.name,
                    newTotalClasses: sub.totalClasses,
                    newClassesAttended: sub.classesAttended,
                });
                if (data.ok)
                    toast.success(`${sub.name} marked ${present ? 'present' : 'absent'}.`, {
                        position: 'bottom-center',
                    });
                else
                    toast.error(
                        `Error marking ${present ? 'present' : 'absent'} for ${sub.name}.: ${data.message}`,
                        {
                            position: 'bottom-center',
                        }
                    );
            }
        } catch (e) {
            toast.error('Client side error, check browser logs for details.', {
                position: 'bottom-center',
            });
            console.error(e);
        } finally {
            setLoading(false);
            await getSubjectData();
        }
    }
    if (loading)
        return (
            <div className='flex pt-56 flex-1 justify-center items-center'>
                <Spinner />
            </div>
        );
    else
        return (
            <>
                <h1 className={'text-3xl font-extrabold'}>Dashboard</h1>
                <p className={'text-muted-foreground'}>Overview of your attendance</p>
                <section className={'my-5'}>
                    <h2 className={'text-2xl font-bold mb-3'}>Quick Actions</h2>
                    <div className={'flex flex-col justify-start gap-2 flex-nowrap'}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Classes Today ({classesToday.length}) </CardTitle>
                                <CardAction>{new Date().toDateString()}</CardAction>
                            </CardHeader>
                            {classesToday.length > 0 ? (
                                <CardContent className={'flex flex-wrap gap-2'}>
                                    {classesToday.map((sub, index) => {
                                        return (
                                            <Card key={index} className={'py-2 flex-1 bg-input'}>
                                                <CardContent className={'text-center font-bold'}>
                                                    {sub.name}
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </CardContent>
                            ) : (
                                <CardContent className={'text-muted-foreground'}>
                                    No classes scheduled for today.
                                </CardContent>
                            )}
                            <CardFooter className={'w-full flex'}>
                                <div
                                    className={
                                        'flex w-full gap-5 flex-row items-center justify-start flex-wrap'
                                    }
                                >
                                    <Button
                                        disabled={classesToday.length <= 0}
                                        className={'flex-1'}
                                        onClick={async () => await markAll(true)}
                                        variant={'outline'}
                                    >
                                        Mark all present
                                    </Button>
                                    <Button
                                        disabled={classesToday.length <= 0}
                                        className={'flex-1'}
                                        onClick={async () => await markAll(false)}
                                        variant={'outline'}
                                    >
                                        Mark all absent
                                    </Button>
                                    <Button
                                        className={'flex-1'}
                                        onClick={() => navigate('/subjects')}
                                        variant={'outline'}
                                    >
                                        Mark custom
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </section>
                <section className={'my-5'}>
                    <Card className={'my-5'}>
                        <CardHeader>
                            <CardTitle>Overall Attendance</CardTitle>
                            <CardAction>
                                {totalClasses &&
                                Math.floor((classesAttended / totalClasses) * 100) >= 75 ? (
                                    <TrendingUpIcon className={'stroke-green-500'} />
                                ) : (
                                    <TrendingDownIcon className={'stroke-red-500'} />
                                )}
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <p className={'text-5xl font-extrabold'}>
                                {totalClasses
                                    ? Math.floor((classesAttended / totalClasses) * 100)
                                    : 0}
                                %
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Progress
                                progressColor={
                                    totalClasses &&
                                    Math.floor((classesAttended / totalClasses) * 100) >= 75
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                }
                                className={
                                    totalClasses &&
                                    Math.floor((classesAttended / totalClasses) * 100) >= 75
                                        ? 'bg-green-500/50'
                                        : 'bg-red-500/50'
                                }
                                value={
                                    totalClasses > 0
                                        ? Math.floor((classesAttended / totalClasses) * 100)
                                        : 0
                                }
                            />
                        </CardFooter>
                    </Card>
                    <div className={'flex gap-5'}>
                        <Card className={'w-full justify-center'}>
                            <CardHeader className={'justify-center items-center'}>
                                <div className={'flex gap-2 items-center justify-center'}>
                                    <p className={'text-xl text-center font-bold'}>
                                        {classesAttended}
                                    </p>
                                    <CircleCheckBigIcon
                                        size={40}
                                        className={'rounded-xl p-2 bg-green-200 stroke-green-500'}
                                    />
                                </div>
                                <p className={'text-muted-foreground text-center'}>
                                    Classes Attended
                                </p>
                            </CardHeader>
                        </Card>
                        <Card className={'w-full justify-center'}>
                            <CardHeader className={'justify-center items-center'}>
                                <div className={'flex gap-2 items-center justify-center'}>
                                    <p className={'text-xl text-center font-bold'}>
                                        {totalClasses}
                                    </p>
                                    <BookOpenIcon
                                        size={40}
                                        className={'rounded-xl p-2 bg-[#DAE1F9] stroke-primary'}
                                    />
                                </div>
                                <p className={'text-muted-foreground text-center'}>Total Classes</p>
                            </CardHeader>
                        </Card>
                        <Card className={'w-full justify-center'}>
                            <CardHeader className={'justify-center items-center'}>
                                <div className={'flex gap-2 items-center justify-center'}>
                                    <p className={'text-xl text-center font-bold'}>
                                        {totalClasses - classesAttended}
                                    </p>
                                    <XCircleIcon
                                        size={40}
                                        className={'rounded-xl p-2 bg-red-200 stroke-red-500'}
                                    />
                                </div>
                                <p className={'text-muted-foreground text-center'}>
                                    Classes missed
                                </p>
                            </CardHeader>
                        </Card>
                    </div>
                </section>
                <section className={'my-5'}>
                    <h2 className={'text-2xl font-bold mb-3'}>Subjects overview</h2>
                    {subjects.length <= 0 && (
                        <p className={'text-muted-foreground'}>
                            No subjects found, create a subject to display.
                        </p>
                    )}
                    {subjects.length > 0 && (
                        <div className={'grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}>
                            {subjects.map((sub) => {
                                return <SubjectOverviewCard key={sub.name} {...sub} />;
                            })}
                        </div>
                    )}
                </section>
            </>
        );
};

export default DashboardPage;
