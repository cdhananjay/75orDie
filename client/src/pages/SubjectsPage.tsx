import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner';
import SubjectAttendanceCard from '@/components/SubjectAttendanceCard';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';

type subject = {
    name: string;
    classesAttended: number;
    totalClasses: number;
    occurrence: number[];
};

const SubjectsPage = () => {
    const [subjects, setSubjects] = useState<subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [displayCard, setDisplayCard] = useState(false);
    const [subjectName, setSubjectName] = useState('');

    const getSubjectData = async () => {
        try {
            const { data } = await axios.get('/api/sub/');
            if (data.ok) setSubjects(data.subjects);
        } catch (e) {
            toast.error('Internal Server Error', {
                position: 'top-center',
            });
            console.log(e);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getSubjectData();
    }, []);

    async function createSubject(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        e.preventDefault();
        setDisplayCard(false);
        try {
            const { data } = await axios.post('/api/sub', { subjectName });
            if (data.ok) {
                toast.success('subject created', {
                    position: 'top-center',
                });
                setLoading(true);
                return getSubjectData();
            } else
                toast.error(data.message, {
                    position: 'top-center',
                });
        } catch (e) {
            toast.error('internal server error', {
                position: 'top-center',
            });
            console.log(e);
        }
    }

    if (loading)
        return (
            <div className="flex pt-56 flex-1 justify-center items-center">
                <Spinner />
            </div>
        );
    else
        return (
            <>
                <div className={'flex justify-between items-center '}>
                    <div>
                        <h1 className={'text-3xl font-extrabold'}>
                            All Subjects
                        </h1>
                        <p className={'text-muted-foreground'}>
                            Mark attendance and view details for specific
                            subjects.
                        </p>
                    </div>
                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button variant="default">
                                    {' '}
                                    <PlusIcon /> Create Subject
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm">
                                <DialogHeader>
                                    <DialogTitle>
                                        Create New Subject
                                    </DialogTitle>
                                </DialogHeader>
                                <FieldGroup>
                                    <Field>
                                        <Label htmlFor="name-1">Name</Label>
                                        <Input
                                            onChange={(e) =>
                                                setSubjectName(e.target.value)
                                            }
                                            id="name-1"
                                            name="name"
                                        />
                                    </Field>
                                </FieldGroup>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        onClick={(e) => createSubject(e)}
                                        type="submit"
                                    >
                                        Save changes
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                    {displayCard && (
                        <Card className="fixed md:absolute top-1/2 md:top-full left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:translate-y-0 right-auto md:right-0 mt-0 md:mt-2 w-full max-w-sm z-50 shadow-lg">
                            <CardContent>
                                <form>
                                    <div className="flex flex-col gap-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="subjectName">
                                                Subject Name
                                            </Label>
                                            <Input
                                                onChange={(e) =>
                                                    setSubjectName(
                                                        e.target.value
                                                    )
                                                }
                                                id="subjectName"
                                                type="text"
                                                required
                                            />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button
                                    onClick={async (e) =>
                                        await createSubject(e)
                                    }
                                    type="submit"
                                    className="w-full"
                                >
                                    <PlusIcon /> Create Subject
                                </Button>
                                <Button
                                    onClick={() => setDisplayCard(false)}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <XIcon /> Cancel
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
                <div
                    className={
                        'my-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                    }
                >
                    {subjects.map((sub) => (
                        <SubjectAttendanceCard key={sub.name} name={sub.name} />
                    ))}
                </div>
            </>
        );
};

export default SubjectsPage;
