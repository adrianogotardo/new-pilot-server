export function isValidDateString(dateString) {
    // Expressão regular para verificar o formato "YYYY-MM-DDTHH:MM:SS±HH:MM"
    const regex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d([+-](0[0-9]|1[0-4]):[0-5]\d)$/;
    return regex.test(dateString);
};