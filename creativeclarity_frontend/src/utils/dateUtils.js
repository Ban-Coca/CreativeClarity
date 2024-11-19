const formatDate = (date) => {
    const dateObj = new Date(date);
    return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
};

const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

export { formatDate, formatDateForInput };
// Alternatively, you can use:
// export default { formatDate, formatDateForInput };