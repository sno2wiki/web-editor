export const calcCursorIndex = (prev: string, next: string): number => {
  if (prev === next) {
    return -1;
  } else if (prev.length === next.length) {
    return prev.length - prev.split("").reverse().findIndex((char, i) => next[prev.length - i - 1] !== char);
  } else if (prev.length < next.length) {
    if (next.slice(0, prev.length) === prev) return next.length;
    else if (next.slice(next.length - prev.length) === prev) return next.length - prev.length;
    else return (next.length - prev.split("").reverse().findIndex((char, i) => next[next.length - i - 1] !== char));
  } else {
    if (prev.slice(0, next.length) === next) return next.length;
    else if (prev.slice(prev.length - next.length) === next) return 0;
    else return next.split("").findIndex((char, i) => prev[i] !== char);
  }
};
