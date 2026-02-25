export function getToneColor(tone?: string): string {
    switch (tone) {
        case 'green':
            return 'bg-green-50 border-green-200 text-green-900';
        case 'blue':
            return 'bg-blue-50 border-blue-200 text-blue-900';
        case 'amber':
            return 'bg-amber-50 border-amber-200 text-amber-900';
        case 'orange':
            return 'bg-orange-50 border-orange-200 text-orange-900';
        case 'red':
            return 'bg-red-50 border-red-200 text-red-900';
        default:
            return '';
    }
}
