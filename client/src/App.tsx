import { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState('test');
    useEffect(() => {
        fetch('/api/sub/')
            .then((res) => res.json())
            .then((res) => setData(res.message))
            .catch((e) => setData(e));
    }, []);
    return (
        <>
            <h1 className={'text-gray-400'}>{data}</h1>
        </>
    );
}

export default App;
