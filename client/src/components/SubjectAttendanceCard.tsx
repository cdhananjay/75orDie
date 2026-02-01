import {
    Card,
    CardAction,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TriangleAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type props = {
    name: string;
    onDelete: (name: string) => void;
};

type subjectT = {
    name: string;
    classesAttended: number;
    totalClasses: number;
    occurrence: number[];
};

const SubjectOverviewCard = ({ name, onDelete }: props) => {
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState<subjectT | undefined>(undefined);

    const navigate = useNavigate();

    useEffect(() => {
        getSubject();
    }, []);

    async function getSubject() {
        try {
            const { data } = await axios.get('/api/sub/');
            if (data.ok) {
                for (const sub of data.subjects) {
                    if (sub.name === name) {
                        setSubject(sub);
                        break;
                    }
                }
            } else {
                toast.error(data.message, {
                    position: 'bottom-center',
                });
            }
        } catch (e) {
            toast.error('Client side error, check browser logs for details.', {
                position: 'bottom-center',
            });
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function addAttendance(present: boolean) {
        setLoading(true);
        try {
            if (!subject)
                return toast.error('Subject required.', {
                    position: 'bottom-center',
                });
            const newTotalClasses = subject.totalClasses + 1;
            const newClassesAttended = present
                ? subject.classesAttended + 1
                : subject.classesAttended;
            const { data } = await axios.patch('/api/sub', {
                subjectName: name,
                newTotalClasses,
                newClassesAttended,
            });
            if (data.ok) {
                toast.success(`Attendance updated.`, {
                    position: 'bottom-center',
                });
                setSubject({
                    ...subject,
                    totalClasses: newTotalClasses,
                    classesAttended: newClassesAttended,
                });
            } else {
                toast.error(data.message, {
                    position: 'bottom-center',
                });
            }
        } catch (e) {
            toast.error('Client side error, check browser logs for details.', {
                position: 'bottom-center',
            });
            console.error(e);
        } finally {
            setLoading(false);
            navigate('/subjects');
        }
    }

    if (loading || !subject)
        return (
            <Card>
                <CardContent className={'flex items-center justify-center'}>
                    <Spinner />
                </CardContent>
            </Card>
        );

    const { classesAttended, totalClasses } = subject;
    const percentage = totalClasses > 0 ? Math.floor((classesAttended / totalClasses) * 100) : 0;

    return (
        <Card>
            <CardHeader>
                <CardTitle className={'text-lg'}>{name}</CardTitle>
                <CardAction>
                    {totalClasses && percentage < 75 ? (
                        <TriangleAlertIcon className={'stroke-red-500'} />
                    ) : (
                        <></>
                    )}
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className={'mb-1 flex justify-between items-baseline'}>
                    <p className={'text-xl'}>{percentage}%</p>
                    <p
                        className={'text-muted-foreground'}
                    >{`Attended: ${classesAttended}/${totalClasses}`}</p>
                </div>
                <Progress
                    progressColor={percentage >= 75 ? 'bg-green-500' : 'bg-red-500'}
                    className={percentage >= 75 ? 'bg-green-500/50' : 'bg-red-500/50'}
                    value={percentage}
                />
            </CardContent>
            <CardFooter className={'gap-3 flex-wrap'}>
                <Button onClick={async () => await addAttendance(true)} variant={'outline'}>
                    Mark Present
                </Button>
                <Button onClick={async () => await addAttendance(false)} variant={'outline'}>
                    Mark Absent
                </Button>
                <Button onClick={() => onDelete(name)} variant='destructive'>
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SubjectOverviewCard;
