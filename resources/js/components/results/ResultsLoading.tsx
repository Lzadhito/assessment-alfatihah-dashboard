import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ResultsLoading() {
    return (
        <div>
            <section className="p-4 pb-0 lg:p-8 lg:pb-0">
                <div className="flex justify-end gap-2">
                    <Skeleton className="h-10 w-10" />
                </div>
            </section>
            <main className="container mx-auto space-y-8 p-4 lg:p-8">
                <header className="flex gap-4">
                    <Skeleton className="h-22 w-22 rounded-lg" />
                    <div className="flex-1">
                        <Skeleton className="mb-2 h-9 w-96" />
                        <Skeleton className="h-5 w-48" />
                    </div>
                </header>

                <Card className="mb-6">
                    <CardContent className="flex items-start justify-between">
                        <div className="flex-1">
                            <Skeleton className="mb-2 h-7 w-48" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-7 w-32" />
                    </CardContent>
                </Card>

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Card>
                        <CardContent>
                            <Skeleton className="mb-2 h-16 w-24" />
                            <Skeleton className="mb-4 h-5 w-16" />
                            <Skeleton className="mb-2 h-7 w-full" />
                            <Skeleton className="mb-4 h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                        </CardContent>
                    </Card>
                    <Card className="xl:col-span-2">
                        <CardContent className="flex min-h-[50vh] w-full items-center justify-center">
                            <Skeleton className="h-96 w-96 rounded-full" />
                        </CardContent>
                    </Card>
                </section>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <Card key={index}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <Skeleton className="mb-2 h-7 w-40" />
                                        <Skeleton className="h-5 w-full" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
