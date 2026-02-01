import { Button } from '@/components/ui/button';
import { PlusIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type subject = {
    name: string;
    classesAttended: number;
    totalClasses: number;
    occurrence: number[];
};

const TimetablePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState<subject[]>([]);
    const [selectedSub, setSelectedSub] = useState(-1);
    const [dayToAdd, setDayToAdd] = useState(-1);
    const [dayToRemove, setDayToRemove] = useState(-1);
    const [days, setDays] = useState<{ name: string; classes: subject[] }[]>([
        { name: 'Sunday', classes: [] },
        { name: 'Monday', classes: [] },
        { name: 'Tuesday', classes: [] },
        { name: 'Wednesday', classes: [] },
        { name: 'Thursday', classes: [] },
        { name: 'Friday', classes: [] },
        { name: 'Saturday', classes: [] },
    ]);
    async function addSubjectToDay() {
        setLoading(true);
        if (selectedSub == -1)
            return toast.error('No subject selected.', {
                position: 'bottom-center',
            });
        if (dayToAdd == -1)
            return toast.error('Select a day first.', {
                position: 'bottom-center',
            });
        try {
            subjects[selectedSub].occurrence[dayToAdd]++;
            const { data } = await axios.patch('/api/sub', {
                subjectName: subjects[selectedSub].name,
                newOccurrence: subjects[selectedSub].occurrence,
            });
            if (data.ok) {
                toast.success('Timetable updated.', {
                    position: 'bottom-center',
                });
                const updatedSubjects = [...subjects];
                updatedSubjects[selectedSub] = {
                    ...updatedSubjects[selectedSub],
                    occurrence: updatedSubjects[selectedSub].occurrence.map((val, i) =>
                        i === dayToAdd ? val + 1 : val
                    ),
                };
                setSubjects(updatedSubjects);
            } else
                toast.error(data.message, {
                    position: 'bottom-center',
                });
        } catch (e) {
            toast.error('Client side error, check browser console for details.', {
                position: 'bottom-center',
            });
            console.error(e);
        } finally {
            setSelectedSub(-1);
            setDayToAdd(-1);
            fillTimetable();
        }
    }

    async function removeSubjectFromDay() {
        setLoading(true);
        if (selectedSub == -1)
            return toast.error('No subject selected.', {
                position: 'bottom-center',
            });
        if (dayToRemove == -1)
            return toast.error('Select a day first.', {
                position: 'bottom-center',
            });
        if (subjects[selectedSub].occurrence[dayToRemove] == 0)
            return toast.error('Client side error, check browser console for details.', {
                position: 'bottom-center',
            });
        try {
            subjects[selectedSub].occurrence[dayToRemove]--;
            const { data } = await axios.patch('/api/sub', {
                subjectName: subjects[selectedSub].name,
                newOccurrence: subjects[selectedSub].occurrence,
            });
            if (data.ok) {
                toast.success('Timetable updated.', {
                    position: 'bottom-center',
                });
                const updatedSubjects = [...subjects];
                updatedSubjects[selectedSub] = {
                    ...updatedSubjects[selectedSub],
                    occurrence: updatedSubjects[selectedSub].occurrence.map((val, i) =>
                        i === dayToAdd ? val + 1 : val
                    ),
                };
                setSubjects(updatedSubjects);
            } else
                toast.error(data.message, {
                    position: 'bottom-center',
                });
        } catch (e) {
            toast.error(`Client side error, check browser console for details`, {
                position: 'bottom-center',
            });
            console.error(e);
        } finally {
            setSelectedSub(-1);
            setDayToRemove(-1);
            fillTimetable();
        }
    }

    const fillTimetable = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/sub/');
            if (!data.ok) {
                toast.error(data.message, {
                    position: 'top-center',
                });
                return navigate('/');
            }
            setSubjects(data.subjects);
            const tempDays: { name: string; classes: subject[] }[] = [
                { name: 'Sunday', classes: [] },
                { name: 'Monday', classes: [] },
                { name: 'Tuesday', classes: [] },
                { name: 'Wednesday', classes: [] },
                { name: 'Thursday', classes: [] },
                { name: 'Friday', classes: [] },
                { name: 'Saturday', classes: [] },
            ];
            for (const sub of data.subjects) {
                for (let i = 1; i <= 7; i++) {
                    if (sub.occurrence[i] > 0)
                        for (let j = 0; j < sub.occurrence[i]; j++) tempDays[i].classes.push(sub);
                }
            }
            setDays(tempDays);
        } catch (e) {
            toast.error('Client side error, check browser console for details', {
                position: 'top-center',
            });
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fillTimetable();
    }, []);

    if (loading)
        return (
            <div className='flex pt-56 flex-1 justify-center items-center'>
                <Spinner />
            </div>
        );
    else
        return (
            <>
                <div className={'flex gap-2 flex-wrap justify-between items-center'}>
                    <div>
                        <h1 className={'text-3xl font-extrabold'}>All Subjects</h1>
                        <p className={'text-muted-foreground'}>
                            Mark attendance and view details for specific subjects.
                        </p>
                    </div>
                    <div className={'flex items-center justify-center gap-3'}>
                        <Dialog>
                            <form>
                                <DialogTrigger asChild>
                                    <Button variant='default'>
                                        {' '}
                                        <XIcon />
                                        Remove
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='sm:max-w-sm'>
                                    <DialogHeader>
                                        <DialogTitle>Remove Subject</DialogTitle>
                                        <DialogDescription>
                                            Select subject and day to remove it from.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <FieldGroup>
                                        <Field>
                                            <Label>Subject</Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setSelectedSub(Number(value))
                                                }
                                            >
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue
                                                        placeholder={
                                                            subjects && subjects.length > 0
                                                                ? 'select a subject..'
                                                                : 'no subjects found'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Subjects</SelectLabel>
                                                        {subjects.map((sub, index) => (
                                                            <SelectItem
                                                                key={sub.name}
                                                                value={index.toString()}
                                                            >
                                                                {sub.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field>
                                            <Label>Select day to remove from</Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setDayToRemove(Number(value))
                                                }
                                                disabled={selectedSub == -1}
                                            >
                                                <SelectTrigger className='w-full'>
                                                    {selectedSub >= 0 && (
                                                        <SelectValue placeholder='select day..' />
                                                    )}
                                                    {selectedSub < 0 && (
                                                        <SelectValue placeholder='select a subject first' />
                                                    )}
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Days</SelectLabel>
                                                        {selectedSub >= 0 &&
                                                            subjects[selectedSub].occurrence.map(
                                                                (val, index) => {
                                                                    if (val > 0 && index > 0)
                                                                        return (
                                                                            <SelectItem
                                                                                key={index}
                                                                                value={index.toString()}
                                                                            >
                                                                                {days[index].name}
                                                                            </SelectItem>
                                                                        );
                                                                }
                                                            )}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </FieldGroup>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                onClick={() => setSelectedSub(-1)}
                                                variant='outline'
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button onClick={removeSubjectFromDay} type='submit'>
                                                Save changes
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </form>
                        </Dialog>
                        <Dialog>
                            <form>
                                <DialogTrigger asChild>
                                    <Button variant='default'>
                                        {' '}
                                        <PlusIcon /> Add{' '}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className='sm:max-w-sm'>
                                    <DialogHeader>
                                        <DialogTitle>Add Subject</DialogTitle>
                                        <DialogDescription>
                                            Select subject and a day to add into.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <FieldGroup>
                                        <Field>
                                            <Label>Subject</Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setSelectedSub(Number(value))
                                                }
                                            >
                                                <SelectTrigger className='w-full'>
                                                    <SelectValue
                                                        placeholder={
                                                            subjects && subjects.length > 0
                                                                ? 'select a subject..'
                                                                : 'no subjects found'
                                                        }
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Subjects</SelectLabel>
                                                        {subjects.map((sub, index) => (
                                                            <SelectItem
                                                                key={sub.name}
                                                                value={index.toString()}
                                                            >
                                                                {sub.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                        <Field>
                                            <Label>Select day to add to</Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setDayToAdd(Number(value))
                                                }
                                                disabled={selectedSub == -1}
                                            >
                                                <SelectTrigger className='w-full'>
                                                    {selectedSub >= 0 && (
                                                        <SelectValue placeholder='select a day..' />
                                                    )}
                                                    {selectedSub < 0 && (
                                                        <SelectValue placeholder='select a subject first' />
                                                    )}
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Days</SelectLabel>
                                                        {days.map((day, index) => {
                                                            if (index != 0)
                                                                return (
                                                                    <SelectItem
                                                                        key={day.name}
                                                                        value={index.toString()}
                                                                    >
                                                                        {day.name}
                                                                    </SelectItem>
                                                                );
                                                        })}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    </FieldGroup>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                onClick={() => setSelectedSub(-1)}
                                                variant='outline'
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button onClick={addSubjectToDay} type='submit'>
                                                Save changes
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </form>
                        </Dialog>
                    </div>
                </div>
                <section className={'my-5 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5'}>
                    {days.map((day, index) => {
                        if (index > 0)
                            return (
                                <Card key={day.name}>
                                    <CardHeader>
                                        <CardTitle>{day.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className={'grid gap-3'}>
                                        {day.classes.length == 0 && (
                                            <p className={'text-muted-foreground'}>
                                                no classes scheduled
                                            </p>
                                        )}
                                        {day.classes.map((sub, i) => {
                                            return (
                                                <div
                                                    className={
                                                        'bg-input px-3 py-2 rounded-lg font-bold'
                                                    }
                                                    key={`${sub.name}-${i}`}
                                                >
                                                    {sub.name}
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            );
                    })}
                </section>
            </>
        );
};
export default TimetablePage;
