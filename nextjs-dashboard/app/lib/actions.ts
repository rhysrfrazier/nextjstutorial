'use server';
// This ^^ is for making server side components that can be called from client-side or server-side code, remember?
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
// ^^ Next.js has a client-side router cache that stores route segments in the user's cache for a while. It does prefetching that ensures the user can quickly navigate between routes without making more calls to the server, but without including revalidatePath, that would mean our new invoices wouldn't show up on the client side, since the client side would be using stale data. revalidatePath clears the cache and triggers a new request to the server, updating the data - but only when you need to, and not constantly 
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    // ^^ note that there's a setting to coerce whatever datatype was entered (in this case a string) into a number
    status: z.enum(['pending', 'paid']),
    //.enum is how zod declares a schema that only has certain allowable string values. These values should be passed in as an array, as we do here.
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true});
//.omit is inspired by TS's built-in Omit utility type. It pretty much does what it says on the tin, so CreateInvoice is a Type that uses the FormSchema we defined above, but doesn't include a required id or date

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        //the string parameters of the get come from the name field in the form component
        amount: formData.get('amount'),
        status: formData.get('status')
    });
    const amountInCents = amount * 100;
    // ^^ you generally want to store monetary amounts in cents for the same of precision, since it helps avoid floating-point errors
    const date = new Date().toISOString().split('T')[0];
    //the ISO date has timestamp info after a 'T' in the string that we get back, and we aren't interested in the time info. So we split the string at the T, which gives us an array with two substrings. The first substring is the one we're interested, which is yyyy-mm-dd, so we target that part of the array with [0].

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
    //We don't want to hang out on the form page indefinitely, so redirect the user back to the invoices page
}

//Now adding the update action

const UpdateInvoice = FormSchema.omit({ id: true, date: true});

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });

    const amountInCents = amount * 100;

    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}