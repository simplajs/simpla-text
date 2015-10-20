export default (str) => str.split(/(?=[A-Z])/).map(piece => piece.toLowerCase()).join('-');
