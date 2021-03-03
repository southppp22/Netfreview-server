export function getDateInHour() {
  const timezoneOffset = new Date().getTimezoneOffset() * 60000;
  const timezoneDate = new Date(Date.now() - timezoneOffset + 3600);
  timezoneDate.setHours(timezoneDate.getHours() + 1);
  const ISODate = timezoneDate.toISOString();
  return `${ISODate.slice(0, 10)} ${ISODate.slice(11, 19)}`;
}
