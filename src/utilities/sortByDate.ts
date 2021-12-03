import QuackI from '../interfaces/quackI';

function sortByDate(arrayToSort: QuackI[]): QuackI[] {
    try {
        arrayToSort.sort((a,b) => {
            const dateA: any = /*(a.updatedAt) ? a.updatedAt : */new Date(a.date);
            const dateB: any = /*(b.updatedAt) ? b.updatedAt : */new Date(b.date);
            return (dateB - dateA);  
        });
        return arrayToSort;

    } catch (error: any) {
        console.error(error.message);
        return error.message;
    }
}

export default sortByDate;