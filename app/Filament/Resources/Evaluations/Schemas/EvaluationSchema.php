<?php

namespace App\Filament\Resources\Evaluations\Schemas;

use App\Models\Evaluation;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class EvaluationSchema
{
    /**
     * @var array<string, array{jaliy: string[], khafiy: string[]}>
     */
    private const EVALUATION_OPTIONS = [
        'ayat_1' => [
            'label' => 'Ayat 1 – بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
            'jaliy' => [
                'Membaca ب menjadi م [Ketepatan Huruf]',
                'Membaca ه‍ menjadi ح atau خ pada lafadz الله [Ketepatan Huruf]',
                'Membaca ح menjadi ه‍ atau خ pada kata الرحمن الرحيم [Ketepatan Huruf]',
                'Membaca ر menjadi خ/و/tanpa getar pada kata الرحمن الرحيم  [Ketepatan Huruf]',
                'Membaca س menjadi ش/ص [Ketepatan Huruf]',
                'Salah tasydid  الله.. الرحمن..  الرحيم [Tasydid]',
                'Terjadi salah membaca harakat [Harakat]',
                'Salah mad (kurang dari 2 harakat) [Panjang Pendek]',
            ],
            'khafiy' => [
                'Membaca س sukun dengan dipantulkan (qolqolah) pada kata بسم [Ketepatan Huruf]',
                'Kurang tebal ر pada kata الرحمن الرحيم  [Ketepatan Huruf]',
                'Kurang menyempurnakan Harakat [Harakat]',
                'Artikulasi huruf kurang tegas [Ketepatan Huruf]',
                'Harakat kasrah dibaca seperti \'e\' [Harakat]',
                'Kadar mad thabi\'i lebih dari 2 harakat [Harakat]',
                'Kurangnya tempo bacaan huruf sukun pada huruf س dan ح [Ketepatan Huruf]',
            ],
        ],
        'ayat_2' => [
            'label' => 'Ayat 2 – الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            'jaliy' => [
                'Membaca ح menjadi ه‍ atau خ pada kata الحمد [Ketepatan Huruf]',
                'Membaca ه‍ menjadi ح atau خ pada lafadz الله [Ketepatan Huruf]',
                'Kurang tasydid pada kata ربِّ [Tasydid]',
                'Membaca ب menjadi م [Ketepatan Huruf]',
                'Membaca ع menjadi أ atau \'nga\' pada kata العالمين [Ketepatan Huruf]',
                'Terjadi salah membaca harakat  [Harakat]',
                'Salah mad (kurang dari 2 harakat) [Panjang Pendek]',
            ],
            'khafiy' => [
                'Memantulkan pelafalan huruf ل pada الحمد [Ketepatan Huruf]',
                'Membaca ر dengan tipis pada kata رب [Ketepatan Huruf]',
                'Kurangnya tempo bacaan huruf sukun pada huruf ل dan م [Ketepatan Huruf]',
                'Harakat kasrah dibaca seperti \'e\' [Harakat]',
                'Kadar mad thabi\'i lebih dari 2 harakat [Panjang Pendek]',
                'Kurang menyempurnakan Harakat  [Harakat]',
                'Artikulasi huruf kurang tegas [Ketepatan Huruf]',
            ],
        ],
        'ayat_3' => [
            'label' => 'Ayat 3 – الرَّحْمَنِ الرَّحِيمِ',
            'jaliy' => [
                'Membaca ح menjadi ه‍ atau خ pada kata الرحمن الرحيم [Ketepatan Huruf]',
                'Membaca ر menjadi خ/و/tanpa getar pada kata الرحمن الرحيم [Ketepatan Huruf]',
                'Kurang tasydid pada kata  الرحمن..  الرحيم [Tasydid]',
                'Terjadi salah membaca harakat [Harakat]',
                'Salah mad (kurang dari 2 harakat) [Panjang Pendek]',
            ],
            'khafiy' => [
                'Kurang tebal ر pada kata الرحمن الرحيم [Ketepatan Huruf]',
                'Kurang menyempurnakan Harakat [Harakat]',
                'Artikulasi huruf kurang tegas [Ketepatan Huruf]',
                'Harakat kasrah dibaca seperti \'e\' [Harakat]',
                'Kadar mad thabi\'i lebih dari 2 harakat [Panjang Pendek]',
                'Kurangnya tempo bacaan huruf sukun pada huruf ح pada الرحمن [Ketepatan Huruf]',
            ],
        ],
        'ayat_4' => [
            'label' => 'Ayat 4 – مَالِكِ يَوْمِ الدِّينِ',
            'jaliy' => [
                'Membaca ك menjadi ق [Ketepatan Huruf]',
                'Membaca و menjadi o pada kata يوم menjadi yowmi [Ketepatan Huruf]',
                'Membaca د menjadi ت [Ketepatan Huruf]',
                'Kurang tasydid pada kata الدين [Tasydid]',
                'Terjadi salah membaca harakat [Harakat]',
            ],
            'khafiy' => [
                'Membaca د dengan mengeluarkan nafas (sifat hams) pada kata يوم الدين [Ketepatan Huruf]',
                'Harakat kasrah dibaca seperti \'e\' [Harakat]',
                'Kurang menyempurnakan Harakat [Harakat]',
                'Artikulasi huruf kurang tegas[Ketepatan Huruf]',
                'Kadar mad thabi\'i lebih dari 2 harakat [Panjang Pendek]',
            ],
        ],
        'ayat_5' => [
            'label' => 'Ayat 5 – إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
            'jaliy' => [
                'Kurang tasydid pada kata إيّاكَ [Tasydid]',
                'Menambah mad/panjang di huruf ك pada kata إياك [Panjang Pendek]',
                'Menambah mad/panjang di huruf د pada kata نعبد [Panjang Pendek]',
                'Kurang mad/panjang pada kata إياك [Panjang Pendek]',
                'Membaca ع menjadi ء atau \'ngi\' pada kata نستعين [Ketepatan Huruf]',
                'Terjadi salah membaca harakat [Harakat]',
            ],
            'khafiy' => [
                'Kurangnya tempo bacaan huruf sukun pada huruf ع pada kata نعبد [Ketepatan Huruf]',
                'Kurangnya tempo bacaan huruf sukun pada huruf س pada kata نستعين [Ketepatan Huruf]',
                'Harakat kasrah dibaca seperti \'e\' [Harakat]',
                'Kurang menyempurnakan Harakat [Harakat]',
                'Artikulasi huruf kurang tegas [Ketepatan Huruf]',
                'Kadar mad thabi\'i lebih dari 2 harakat [Panjang Pendek]',
            ],
        ],
        'ayat_6' => [
            'label' => 'Ayat 6 – اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
            'jaliy' => [
                'Membaca ه menjadi ح atau خ pada kata اهدنا [Ketepatan Huruf]',
                'Membaca ص menjadi س atau ش pada kata الصراط [Ketepatan Huruf]',
                'Kurang tasydid pada kata الصراط [Tasydid]',
                'Membaca ق menjadi ك pada kata المستقيم [Ketepatan Huruf]',
            ],
            'khafiy' => [
                'Harakat kasrah dibaca seperti \'e\' [Harakat]',
                'Kurangnya tempo bacaan huruf sukun pada huruf ه pada kata اهدنا [Ketepatan Huruf]',
                'Huruf ر yang kurang tebal pada kata الصراط [Ketepatan Huruf]',
                'Membaca huruf ط dengan mengeluarkan nafas (sifat hams) pada kata الصراط [Ketepatan Huruf]',
                'Kurangnya tempo bacaan huruf sukun pada huruf س pada kata المستقيم [Ketepatan Huruf]',
                'Kurang menyempurnakan Harakat [Harakat]',
                'Artikulasi huruf kurang tegas[Ketepatan Huruf]',
                'Kadar mad thabi\'i lebih dari 2 harakat [Ketepatan]',
            ],
        ],
        'ayat_7' => [
            'label' => 'Ayat 7 (Bagian 1) – صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ',
            'jaliy' => [
                'Membaca ص menjadi س ,ش atau ز pada kata صراط [Ketepatan Huruf]',
                'Membaca ذ menjadi ز atau د pada kata الذين [Ketepatan Huruf]',
                'Kurang tasydid di huruf ذ pada kata الذين [Tasydid]',
                'Menambah mad/panjang huruf ن pada kata الذين [Panjang Pendek]',
                'Membaca ع menjadi أ pada kata أنعمت [Ketepatan Huruf]',
                'Membaca أ menjadi ع pada kata أنعمت [Ketepatan Huruf]',
                'Membaca ن menjadi م atau Izhar menjadi Idgham pada kata أنعمت [Tajwid]',
                'Menambah mad pada huruf ت pada kata أنعمت [Panjang Pendek]',
                'Membaca ع menjadi أ atau nga pada kata عليهم [Ketepatan Huruf]',
            ],
            'khafiy' => [
                'Huruf ر yang kurang tebal pada kata صراط [Ketepatan Huruf]',
                'Membaca huruf ط dengan mengeluarkan nafas (sifat hams) pada kata الصراط [Ketepatan Huruf]',
                'Memantulkan huruf ل pada kata صراط الذين [Ketepatan Huruf]',
                'Kurangnya tempo bacaan huruf sukun pada huruf ن dan م pada kata أنعمت [Ketepatan Huruf]',
                'Kelebihan tempo bacaan huruf sukun pada huruf ن pada م pada kata أنعمت [Ketepatan Huruf]',
                'Memanjang ya sukun lebih dari kadarnya pada kata عليهم [Ketepatan Huruf]',
                'Harakat kasrah dibaca seperti \'e\' [Harakat]',
                'Kurang menyempurnakan Harakat  [Harakat]',
                'Artikulasi huruf kurang tegas [Ketepatan Huruf]',
                'Kadar mad thabi\'i lebih dari 2 harakat [Panjang Pendek]',
            ],
        ],
        'ayat_7_part_2' => [
            'label' => 'Ayat 7 (Bagian 2) – غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
            'jaliy' => [
                'Membaca huruf غ menjadi خ pada kata غير [Ketepatan Huruf]',
                'Menambah mad pada kata غير [Panjang Pendek]',
                'Membaca huruf ض menjadi د pada kata المغضوب [Ketepatan Huruf]',
                'Membaca huruf ع menjadi أ atau \'Nga\' pada kata عليهم [Ketepatan Huruf]',
                'Membaca huruf ه menjadi ح atau خ pada kata عليهم [Ketepatan Huruf]',
                'Masuknya huruf م kepada huruf و (Idgham) pada kata عليهم ولا  [Ketepatan Huruf]',
                'Hilangnya tasydid di huruf ض pada kata ولا الضالين [Tasydid]',
                'Hilang tasydid di huruf ل pada kata ولا الضالين  [Tasydid]',
                'Kurangnya mad dari 6 harakat pada kata الضالين [Panjang Pendek]',
            ],
            'khafiy' => [
                'Kurangnya tempo bacaan huruf sukun pada huruf ل pada kata غير المغضوب [Ketepatan Huruf]',
                'Memantulkan pelafalan huruf غ pada kata المغضوب [Ketepatan Huruf]',
                'Memanjang ya sukun lebih dari kadarnya pada kata غير atau عليهم [Ketepatan Huruf]',
                'Lebihnya tempo bacaan huruf sukun pada huruf م pada kata عليهم [Ketepatan Huruf]',
                'Harakat kasrah dibaca seperti \'e\' [Harakat]',
                'Kurang menyempurnakan Harakat [Harakat]',
                'Artikulasi huruf kurang tegas [Ketepatan Huruf]',
                'Kadar mad thabi\'i lebih dari 2 harakat [Panjang Pendek]',
            ],
        ],
    ];

    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Data Peserta')
                ->columnSpanFull()
                ->schema([
                    Select::make('user_id')
                        ->label('Nama Peserta')
                        ->relationship('user', 'nama_lengkap')
                        ->searchable()
                        ->preload()
                        ->columnSpanFull(),

                    TextInput::make('pemeriksa')
                        ->label('Pemeriksa')
                        ->placeholder('Masukkan nama pemeriksa')
                        ->required(),

                    Select::make('kegiatan')
                        ->label('Nama Kegiatan')
                        ->options(
                            fn () => Evaluation::query()
                                ->whereNotNull('kegiatan')
                                ->distinct()
                                ->orderBy('kegiatan')
                                ->pluck('kegiatan', 'kegiatan')
                                ->prepend('Pengecekan Al-Fatihah - Masjid Nurul Iman', 'Pengecekan Al-Fatihah - Masjid Nurul Iman')
                                ->unique()
                                ->toArray(),
                        )
                        ->searchable()
                        ->createOptionForm([
                            TextInput::make('kegiatan')
                                ->label('Nama Kegiatan')
                                ->required(),
                        ])
                        ->createOptionUsing(fn (array $data): string => $data['kegiatan'])
                        ->required(),

                    Select::make('asal_halaqah')
                        ->label('Jenis Kelamin')
                        ->options([
                            'Ikhwan' => 'Ikhwan',
                            'Akhwat' => 'Akhwat',
                        ])
                        ->required(),
                ]),

            ...self::buildAyatSections(),

            Select::make('rekomendasi_program')
                ->required()
                ->columnSpanFull()
                ->label('Rekomendasi Program')
                ->options([
                    'HITS Dasar' => 'HITS Dasar',
                    'HITS Lanjutan' => 'HITS Lanjutan',
                ]),
        ]);
    }

    /**
     * @return array<Section>
     */
    private static function buildAyatSections(): array
    {
        $sections = [];

        foreach (self::EVALUATION_OPTIONS as $ayatKey => $config) {
            $jaliyOptions = array_combine($config['jaliy'], $config['jaliy']);
            $khafiyOptions = array_combine($config['khafiy'], $config['khafiy']);

            $sections[] = Section::make($config['label'])
                ->statePath($ayatKey)
                ->schema([
                    CheckboxList::make('jaliy')
                        ->label('Kesalahan Jaliy (Jelas)')
                        ->options($jaliyOptions)
                        ->gridDirection('row'),

                    CheckboxList::make('khafiy')
                        ->label('Kesalahan Khafiy (Tersembunyi)')
                        ->options($khafiyOptions)
                        ->gridDirection('row'),
                ]);
        }

        return $sections;
    }
}
