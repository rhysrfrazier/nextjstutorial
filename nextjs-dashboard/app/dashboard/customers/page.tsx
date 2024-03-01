import { Metadata } from "next";
import { lusitana } from "@/app/ui/fonts";
import { fetchFilteredCustomers } from "@/app/lib/data";
import { notFound } from 'next/navigation';
import CustomersTable from "@/app/ui/customers/table";

export const metadata: Metadata = {
    title: 'Customers'
}

export default async function Page({
    searchParams
}: {
    searchParams?: {
        query?: string;
    }
}) {

    const query = searchParams?.query || '';
    const customers = await fetchFilteredCustomers(query);

    return (
        <div className='w-full'>
            <div className='flex w-full items-center justify-between'>
            </div>
            <CustomersTable customers={customers} />
        </div>
    )
}