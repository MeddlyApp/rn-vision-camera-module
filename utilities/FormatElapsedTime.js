export default function formatElapsedTime(value) {
  if (value === 0) return 0;

  const hr = Math.floor(value / 3600);
  const min = Math.floor((value % 3600) / 60);
  const sec = Math.floor((value % 3600) % 60);

  const hours = hr > 0 ? hr : null;
  const minutes = min > 0 ? min : null;
  const seconds = sec > 0 ? sec : null;

  const dHours = hours ? hours : '';
  const dMinutes = minutes ? minutes : '';
  const dSeconds = seconds > 9 ? seconds : `0${seconds ? seconds : 0}`;

  // Everything below is a mess but it seems to be working as expected
  // Needs refactor
  const hasHours = hours && hours > 0;
  const minutesMoreThanNine = dMinutes > 9;

  let fMinutes = '';
  if (hasHours && dMinutes !== '') {
    fMinutes = minutesMoreThanNine ? dMinutes : `0${dMinutes}`;
  } else if (hasHours) fMinutes = '00';
  else fMinutes = dMinutes;

  const showHoursMins = dHours || dMinutes === '' ? ':' : '';
  const showMinsSeconds =
    fMinutes === '00' || dMinutes !== '' || dSeconds === '00' ? ':' : '';

  return dHours + showHoursMins + fMinutes + showMinsSeconds + dSeconds;
}
