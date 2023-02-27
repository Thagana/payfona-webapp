import { formatInTimeZone } from 'date-fns-tz'
import { parseISO } from 'date-fns';

export const formatInvoiceDate = (f: string) => {
    const parsed = parseISO(f);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return formatInTimeZone(parsed, timeZone, 'dd MMM yyyy')
}
