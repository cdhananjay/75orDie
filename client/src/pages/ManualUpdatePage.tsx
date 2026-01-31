import { Button } from '@/components/ui/button';
import { EditIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import axios from 'axios';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateSubject } from '../../../src/controllers/subject.controller';
import { useNavigate } from 'react-router-dom';

type subject = {
    name: string;
    classesAttended: number;
    totalClasses: number;
    occurrence: number[];
};

const ManualUpdatePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState<subject[]>();
    const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(-1);
    const [newClassesAttended, setNewClassesAttended] = useState(-1);
    const [newTotalClasses, setNewTotalClasses] = useState(-1);

    async function updateSubject(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        e.preventDefault();
        if (!subjects) return navigate(0);
        if (selectedSubjectIndex == -1)
            return toast.error('no subject selected', {
                position: 'top-center',
            });
        if (
            !(
                newClassesAttended >= 0 &&
                newTotalClasses >= 0 &&
                Number.isInteger(newTotalClasses) &&
                Number.isInteger(newClassesAttended)
            )
        )
            return toast.error('number of classes should be positive integer', {
                position: 'top-center',
            });
        if (!(newClassesAttended <= newTotalClasses))
            return toast.error('cannot attend more classes than the total', {
                position: 'top-center',
            });
        try {
            const { data } = await axios.patch('/api/sub/', {
                newTotalClasses,
                newClassesAttended,
                subjectName: subjects[selectedSubjectIndex].name,
            });
            if (data.ok) {
                toast.success('updated subject', {
                    position: 'top-center',
                });
            } else
                toast.error(data.message, {
                    position: 'top-center',
                });
        } catch (e) {
            toast.error('Internal Server Error', {
                position: 'top-center',
            });
            console.log(e);
        } finally {
            getSubjectData();
            setNewClassesAttended(-1);
            setNewTotalClasses(-1);
            setLoading(false);
        }
    }
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

    if (loading)
        return (
            <div className="flex pt-56 flex-1 justify-center items-center">
                <Spinner />
            </div>
        );
    else
        return (
            <>
                <div className={'max-w-lg mx-auto'}>
                    <h1 className={'text-3xl font-extrabold'}>Manual Update</h1>
                    <p className={'text-muted-foreground'}>
                        Change number of total classes & attended classes for
                        each subject as per your choice.
                    </p>
                </div>
                <Card className="w-full max-w-lg mx-auto mt-5">
                    <CardContent>
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label>Subject:</Label>
                                    <Select
                                        onValueChange={(value: string) =>
                                            setSelectedSubjectIndex(
                                                Number(value)
                                            )
                                        }
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="choose a subject.." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Subjects
                                                </SelectLabel>
                                                {subjects &&
                                                    subjects.map(
                                                        (sub, index) => {
                                                            return (
                                                                <SelectItem
                                                                    value={index.toString()}
                                                                >
                                                                    {sub.name}
                                                                </SelectItem>
                                                            );
                                                        }
                                                    )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {selectedSubjectIndex >= 0 && (
                                    <Card className={'bg-input/20 gap-2'}>
                                        <CardHeader>
                                            <CardTitle>
                                                Current Values
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent
                                            className={
                                                'flex justify-between items-center'
                                            }
                                        >
                                            <div>
                                                <p
                                                    className={
                                                        'text-muted-foreground'
                                                    }
                                                >
                                                    Attended
                                                </p>
                                                <p
                                                    className={
                                                        'font-bold text-xl'
                                                    }
                                                >
                                                    {subjects
                                                        ? subjects[
                                                              selectedSubjectIndex
                                                          ].classesAttended
                                                        : 'loading..'}
                                                </p>
                                            </div>
                                            <div>
                                                <p
                                                    className={
                                                        'text-muted-foreground'
                                                    }
                                                >
                                                    Total
                                                </p>
                                                <p
                                                    className={
                                                        'font-bold text-xl'
                                                    }
                                                >
                                                    {subjects
                                                        ? subjects[
                                                              selectedSubjectIndex
                                                          ].totalClasses
                                                        : 'loading..'}
                                                </p>
                                            </div>
                                            <div>
                                                <p
                                                    className={
                                                        'text-muted-foreground'
                                                    }
                                                >
                                                    Percentage
                                                </p>
                                                <p
                                                    className={
                                                        'font-bold text-xl'
                                                    }
                                                >
                                                    {subjects
                                                        ? subjects[
                                                              selectedSubjectIndex
                                                          ].totalClasses > 0
                                                            ? Math.floor(
                                                                  (subjects[
                                                                      selectedSubjectIndex
                                                                  ]
                                                                      .classesAttended /
                                                                      subjects[
                                                                          selectedSubjectIndex
                                                                      ]
                                                                          .totalClasses) *
                                                                      100
                                                              )
                                                            : '0'
                                                        : 'loading..'}
                                                    %
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                                <div className="flex gap-3 sm:flex-row flex-col">
                                    <div className="grid gap-2">
                                        <Label htmlFor="classesAttended">
                                            Classes Attended:{' '}
                                        </Label>
                                        <Input
                                            onChange={(e) =>
                                                setNewClassesAttended(
                                                    Number(e.target.value)
                                                )
                                            }
                                            id="classesAttended"
                                            type="number"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="totalClasses">
                                            Total Classes:{' '}
                                        </Label>
                                        <Input
                                            onChange={(e) =>
                                                setNewTotalClasses(
                                                    Number(e.target.value)
                                                )
                                            }
                                            id="totalClasses"
                                            type="number"
                                            required
                                        />
                                    </div>
                                </div>
                                {selectedSubjectIndex >= 0 &&
                                    newTotalClasses >= 0 &&
                                    newClassesAttended >= 0 &&
                                    Number.isInteger(newTotalClasses) &&
                                    Number.isInteger(newClassesAttended) && (
                                        <Card className={'bg-primary/10 gap-2'}>
                                            <CardHeader>
                                                <CardTitle>
                                                    Preview Updated Values
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent
                                                className={
                                                    'flex justify-between items-center'
                                                }
                                            >
                                                <div>
                                                    <p
                                                        className={
                                                            'text-muted-foreground'
                                                        }
                                                    >
                                                        Attended
                                                    </p>
                                                    <p
                                                        className={
                                                            'font-bold text-xl'
                                                        }
                                                    >
                                                        {newClassesAttended}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        className={
                                                            'text-muted-foreground'
                                                        }
                                                    >
                                                        Total
                                                    </p>
                                                    <p
                                                        className={
                                                            'font-bold text-xl'
                                                        }
                                                    >
                                                        {newTotalClasses}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p
                                                        className={
                                                            'text-muted-foreground'
                                                        }
                                                    >
                                                        Percentage
                                                    </p>
                                                    <p
                                                        className={
                                                            'font-bold text-xl'
                                                        }
                                                    >
                                                        {newTotalClasses > 0
                                                            ? Math.floor(
                                                                  (newClassesAttended /
                                                                      newTotalClasses) *
                                                                      100
                                                              )
                                                            : '0'}
                                                        %
                                                    </p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={(e) => updateSubject(e)}
                            variant="default"
                            className="w-full"
                        >
                            <EditIcon /> Update
                        </Button>
                    </CardFooter>
                </Card>
            </>
        );
};
export default ManualUpdatePage;
