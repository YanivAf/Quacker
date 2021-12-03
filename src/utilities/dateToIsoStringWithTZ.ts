function dateToIsoStringWithTZ(date: Date): string {
    try {
        const dateMsc: number = date.getTime();
        const TimeZoneMsc: number = (new Date()).getTimezoneOffset() * 60000;
    
        const shortISOLocalString: string = new Date(dateMsc - TimeZoneMsc).toISOString().slice(0, 16).replace(' ','T');
    
        return shortISOLocalString;
    
    } catch (error: any) {
        console.error(error.message);
        return error.message;
    }
}

export default dateToIsoStringWithTZ;