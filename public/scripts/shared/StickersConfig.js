export const Stickers = [
    { 'name': 'catteftel', 'count': '24', 'icon': '14' },
    { 'name': 'text', 'count': '24', 'icon': '4' },
    { 'name': 'bear', 'count': '25', 'icon': '5' },
    { 'name': 'jack', 'count': '20', 'icon': '4' },
    { 'name': 'finn', 'count': '20', 'icon': '5' },
    { 'name': 'amongus', 'count': '24', 'icon': '11' },
    { 'name': 'cat', 'count': '29', 'icon': '15' },
    { 'name': 'emojis', 'count': '26', 'icon': '9' },
    { 'name': 'goose', 'count': '30', 'icon': '15' },
    { 'name': 'mrpepe', 'count': '24', 'icon': '18' },
    { 'name': 'crab', 'count': '24', 'icon': '1' },
    { 'name': 'death_note', 'count': '20', 'icon': '14' },
    { 'name': 'cutecat', 'count': '33', 'icon': '30' },
    { 'name': 'skully', 'count': '24', 'icon': '23' },
    { 'name': 'robo', 'count': '16', 'icon': '14' },
    { 'name': 'anime', 'count': '25', 'icon': '22' },
    { 'name': 'monkey', 'count': '24', 'icon': '4' },
    { 'name': 'frog', 'count': '30', 'icon': '18' },
    { 'name': 'soul', 'count': '25', 'icon': '14' },
];
export function stickerIsValid(msg) {
    //example: amongus/animated/5
    if (!msg.includes('/')) {
        return false;
    }
    else if (msg.split('/').length != 3) {
        return false;
    }
    const stickerGroup = msg.split('/')[0];
    const stickerNumber = parseInt(msg.split('/')[2]);
    const sticker = Stickers.find((sticker) => sticker.name == stickerGroup);
    if (!sticker || (stickerNumber > parseInt(sticker.count) || stickerNumber < 1)) {
        return false;
    }
    else {
        return true;
    }
}
