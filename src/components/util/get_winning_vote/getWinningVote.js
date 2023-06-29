export const getWinningVote = (votesCountObj, positions) => {
    let totalVotes = 0;
    let winningPositionObj = {};

    if (typeof(votesCountObj) !== "object") {  return { totalVotes, winningPositionObj }; }
    if (typeof(positions) !== "object") {  return { totalVotes, winningPositionObj }; }
    if (Object.keys(votesCountObj).length > 0 && positions.length > 0) {
        // Set total
        totalVotes = (votesCountObj.total || Object.values(votesCountObj).reduce((sum, value) => sum + parseFloat(value), 0));
        delete votesCountObj.total;

        // setValues
        let votesValues = Object.values(votesCountObj).length === 0 ? [0] : Object.values(votesCountObj);

        // setKeys
        let votesKeys = Object.keys(votesCountObj).length === 0 ? [0] : Object.keys(votesCountObj);

        // set winningPositionObj
        winningPositionObj = { count: Math.max(...votesValues), id: votesKeys.find((key) => parseInt(votesCountObj[key]) === Math.max(...votesValues))};

        // set winningPositionObj.name
        if (winningPositionObj.id === undefined) { 
            winningPositionObj.name = positions[0].name 
        } else {
            winningPositionObj.name =   positions && 
                                        positions.filter((position) => position.id.toString() === winningPositionObj.id)[0] && 
                                        positions.filter((position) => position.id.toString() === winningPositionObj.id)[0].name;
        }
    }

    return { totalVotes, winningPositionObj };
}
