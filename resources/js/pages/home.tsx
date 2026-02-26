import { Form, Head } from '@inertiajs/react';
import {
    lookup,
    updateProfile,
} from '@/actions/App/Http/Controllers/EvaluationController';
import InputError from '@/components/ui/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Evaluation = {
    id: string;
    kode_unik: string;
};

type Props = {
    evaluation?: Evaluation;
};

export default function Home({ evaluation }: Props) {
    return (
        <>
            <Head title="Cek Hasil Evaluasi" />

            <div className="grid h-screen w-screen place-items-center p-4">
                {!evaluation ? (
                    <KodeUnikForm />
                ) : (
                    <DataDiriForm evaluation={evaluation} />
                )}
            </div>
        </>
    );
}

function KodeUnikForm() {
    return (
        <Form {...lookup.form()} className="w-full max-w-sm">
            {({ processing, errors }) => (
                <div className="flex flex-col gap-6 rounded-xl border bg-card p-8 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Cek Hasil Evaluasi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Masukkan kode unik yang diberikan oleh pemeriksa
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="kode_unik">Kode Unik</Label>
                        <Input
                            id="kode_unik"
                            name="kode_unik"
                            type="text"
                            autoFocus
                            required
                            autoComplete="off"
                            placeholder="Contoh: AB12CD34"
                            className="uppercase"
                        />
                        <InputError message={errors.kode_unik} />
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full"
                    >
                        {processing && <Spinner className="mr-2" />}
                        Cari
                    </Button>
                </div>
            )}
        </Form>
    );
}

function DataDiriForm({ evaluation }: { evaluation: Evaluation }) {
    return (
        <Form
            {...updateProfile.form(evaluation.id)}
            className="w-full max-w-sm"
        >
            {({ processing, errors }) => (
                <div className="flex flex-col gap-6 rounded-xl border bg-card p-8 shadow-sm">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Data Diri
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kode:{' '}
                            <span className="font-mono font-medium">
                                {evaluation.kode_unik}
                            </span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
                        <Input
                            id="nama_lengkap"
                            name="nama_lengkap"
                            type="text"
                            autoFocus
                            required
                            placeholder="Masukkan nama lengkap Anda"
                        />
                        <InputError message={errors.nama_lengkap} />
                    </div>

                    <Button
                        type="submit"
                        disabled={processing}
                        className="w-full"
                    >
                        {processing && <Spinner className="mr-2" />}
                        Lihat Hasil
                    </Button>
                </div>
            )}
        </Form>
    );
}
