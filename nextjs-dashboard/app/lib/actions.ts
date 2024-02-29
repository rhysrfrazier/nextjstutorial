'use server';
// This ^^ is for making server side components that can be called from client-side or server-side code, remember?
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
// ^^ Next.js has a client-side router cache that stores route segments in the user's cache for a while. It does prefetching that ensures the user can quickly navigate between routes without making more calls to the server, but without including revalidatePath, that would mean our new invoices wouldn't show up on the client side, since the client side would be using stale data. revalidatePath clears the cache and triggers a new request to the server, updating the data - but only when you need to, and not constantly 
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return "Something went wrong";
            }
        }
        throw error;
    }
}

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than $0' }),
    // ^^ note that there's a setting to coerce whatever datatype was entered (in this case a string) into a number
    //stringing the .gt() method lets us tell it that we want the amount to be greater than zero, and lets us add a message to it
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status'
    }),
    //.enum is how zod declares a schema that only has certain allowable string values. These values should be passed in as an array, as we do here.
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
//.omit is inspired by TS's built-in Omit utility type. It pretty much does what it says on the tin, so CreateInvoice is a Type that uses the FormSchema we defined above, but doesn't include a required id or date

//the following is temporary until @types.react-dom is updated:
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}

export async function createInvoice(prevState: State, formData: FormData) {
    // safeParse() will return an object containing either a success or error field. This will help handle validation more gracefully without having put this logic inside the try/catch block.
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        //the string parameters of the get come from the name field in the form component
        amount: formData.get('amount'),
        status: formData.get('status')
    });

    //if form validation fails, return errors early. Otherwise, keep going
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice'
        }
    }

    //prep data for insertion into database:
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    // ^^ you generally want to store monetary amounts in cents for the same of precision, since it helps avoid floating-point errors
    const date = new Date().toISOString().split('T')[0];
    //the ISO date has timestamp info after a 'T' in the string that we get back, and we aren't interested in the time info. So we split the string at the T, which gives us an array with two substrings. The first substring is the one we're interested, which is yyyy-mm-dd, so we target that part of the array with [0].

    //insert data into database
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Invoice'
        }
    }

    //revalidate the cache for the invoices page and redirect the user
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
    //We don't want to hang out on the form page indefinitely, so redirect the user back to the invoices page
    //redirect must be outside the try/catch block, because it works by throwing an error that would be caught up in the catch block (which we don't want or need). Since the catch block includes a return, the redirect will only be hit if the try is successful
}

//Now adding the update action

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.'
        }
    }

    const { customerId, amount, status } = validatedFields.data
    const amountInCents = amount * 100;

    try {
        await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice'
        }
    }


    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

//Delete action

export async function deleteInvoice(id: string) {

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return { message: 'Deleted Invoice' }
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice'
        }
    }

    //you don't need a redirect here because this will happen directly on the dashboard/invoices path, instead of on any sort of detailed view. Calling revalidatePath will trigger a new server request and re-render the table
}