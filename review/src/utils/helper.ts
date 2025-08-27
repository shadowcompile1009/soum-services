export function getCustomName(name: string | null | undefined, maxLength: number = 20): string {
    if (!name || name.trim() === '' ) {
        return 'Anonymous'
    }
    const fullName = name.trim();
    if (fullName.length > maxLength) {
        const firstSpaceIndex = fullName.indexOf(' ');
        if (firstSpaceIndex > -1) {
            return fullName.split(' ')[0]; 
        }
        return fullName.substring(0, maxLength) + '...';
    }
    return fullName;
}
