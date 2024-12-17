const badWords = {
    'siktir': true,
    'porno': true,
    'sik': true,
    'amınakoyayım': true,
    'amcık': true,
    'amk': true,
    'yarrak': true,
    'orospu': true,
    'orospu çocuğu': true,
    'kaltak': true,
    'piç': true,
    'döl': true,
    'fuck': true,
    'bitch': true,
    'amk': true,
    'kevaşe': true,
    'vibrator': true,
};
export function filterMessage(message) {
    const words = message.split(' ');
    let containsBadWords = false;
    const filteredWords = words.map(word => {
        const lowerCaseWord = word.toLowerCase();
        if (badWords[lowerCaseWord]) {
            containsBadWords = true;
            const firstLetter = word[0];
            const lastLetter = word[word.length - 1];
            const censoredPart = '*'.repeat(word.length - 2); // Replacing characters with '*'
            return `${firstLetter}${censoredPart}${lastLetter}`;
        }
        return word;
    });
    return {
        containsBadWords,
        filteredMessage: filteredWords.join(' ')
    };
}
