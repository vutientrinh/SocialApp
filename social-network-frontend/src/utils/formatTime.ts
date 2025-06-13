import { format, formatDistanceToNow } from "date-fns";

export function fDate(date: Date) {
  return format(new Date(date), "dd MMMM yyyy");
}

export function fDateTime(date: Date) {
  return format(new Date(date), "dd MMM yyyy HH:mm");
}

export function fDateTimeSuffix(date: Date) {
  return format(new Date(date), "dd/MM/yyyy hh:mm p");
}

export function fToNow(date: Date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export function convertToDate(dateArray: string): Date {
  const [year, month, day, hours, minutes, seconds, nanoseconds] = dateArray
    .split(",")
    .map(Number);
  const date = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds,
    nanoseconds / 1_000_000
  );
  return date;
}

// fill empty date with count 0
export const fFillEmptyDate = (data: any[]) => {
  // data is an array [{"dayOfWeek": "Monday", "count: 1"}...]
  // fill all days of week with count 0 if it not exist in data
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dataMap = data.reduce((acc, cur) => {
    acc[cur.dayOfWeek] = cur.count;
    return acc;
  }, {});
  const filledData = daysOfWeek.map((day) => {
    return {
      dayOfWeek: day,
      count: dataMap[day] || 0,
    };
  });
  return filledData;
};
