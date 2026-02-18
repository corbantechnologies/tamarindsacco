
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <FileQuestion className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                Page not found
            </h1>
            <p className="mt-4 text-muted-foreground">
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
            </p>
            <div className="mt-6">
                <Button asChild>
                    <Link href="/">
                        Go back home
                    </Link>
                </Button>
            </div>
        </div>
    );
}
