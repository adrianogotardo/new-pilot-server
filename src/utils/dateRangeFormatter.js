export function dateRangeFormatter(date, position) {
    const datePart = date.substring(0, 11);   // 'YYYY-MM-DDT'
    const timeZonePart = date.substring(19);  // '+HH:MM'
    let formattedDate = '';
    if(position === 'start') formattedDate = datePart + '00:00:00' + timeZonePart;
    if(position === 'end') formattedDate = datePart + '23:59:59' + timeZonePart;
    return formattedDate;
}