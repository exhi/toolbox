
export function formatPositionId(positionId) {
    if (!positionId) return '';

    const dimValPairs = positionId.split('>>').splice(1);
    const dimVals = dimValPairs.map((str) => str.split(':')[1]);
    return dimVals.join(' > ');
}