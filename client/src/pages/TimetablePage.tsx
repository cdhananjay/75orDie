import { Button } from '@/components/ui/button';
import { EditIcon, SaveIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import axios from 'axios';
import { toast } from 'sonner';

type subject = {
    name: string;
    classesAttended: number;
    totalClasses: number;
    occurrence: number[];
};

const TimetablePage = () => {
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState<subject>();

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
                <div className={'relative flex justify-between items-center'}>
                    <div>
                        <h1 className={'text-3xl font-extrabold'}>
                            All Subjects
                        </h1>
                        <p className={'text-muted-foreground'}>
                            Mark attendance and view details for specific
                            subjects.
                        </p>
                    </div>
                    <div className={'flex items-center justify-center gap-1'}>
                        {editMode && (
                            <Button
                                variant={'default'}
                                onClick={() => setEditMode(false)}
                            >
                                <SaveIcon /> Save
                            </Button>
                        )}
                        {!editMode && (
                            <Button
                                variant={'default'}
                                onClick={() => setEditMode(true)}
                            >
                                <EditIcon /> Edit timetable
                            </Button>
                        )}
                    </div>
                </div>
                <section
                    className={
                        'my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
                    }
                >
                    to be updated
                </section>
            </>
        );
};

export default TimetablePage;
