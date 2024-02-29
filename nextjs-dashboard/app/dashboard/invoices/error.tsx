'use client';
//this is a client-side component, so you need to opt into it. You need it to be client-side because that's where your errors will come from

import { useEffect } from 'react';

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string};
    reset: () => void;
}) {
    useEffect(() => {
        //optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="flex h-full flex-col items-center justify-center">
            <h2 className='text-center'>Something went wrong!</h2>
            <button
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                onClick={
                    //attempt to recover by trying to re-render the invoices route
                    () => reset()
                }
            >
                Try Again
            </button>
        </main>
    )
}