export default function formatElapsedTime(value: number) {
  if (value === 0) return 0;

  const hr: number = Math.floor(value / 3600);
  const min: number = Math.floor((value % 3600) / 60);
  const sec: number = Math.floor((value % 3600) % 60);

  const hours: number = hr > 0 ? hr : 0;
  const minutes: number = min > 0 ? min : 0;
  const seconds: number = sec > 0 ? sec : 0;

  const dHours: number | string = hours ? hours : '';
  const dMinutes: number | string = minutes ? minutes : '';
  const dSeconds: number | string =
    seconds > 9 ? seconds : `0${seconds ? seconds : 0}`;

  // Everything below is a mess but it seems to be working as expected
  // Needs refactor
  const hasHours: number | boolean = hours && hours > 0;
  const minutesMoreThanNine: boolean = dMinutes > 9;

  let fMinutes: number | string = '';
  if (hasHours && dMinutes !== '') {
    fMinutes = minutesMoreThanNine ? dMinutes : `0${dMinutes}`;
  } else if (hasHours) fMinutes = '00';
  else fMinutes = dMinutes;

  const showHoursMins: string = dHours || dMinutes === '' ? ':' : '';
  const showMinsSeconds: string =
    fMinutes === '00' || dMinutes !== '' || dSeconds === '00' ? ':' : '';

  return dHours + showHoursMins + fMinutes + showMinsSeconds + dSeconds;
}
