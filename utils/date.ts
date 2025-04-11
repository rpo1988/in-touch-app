import dayjs from "dayjs";

export const formatedDateMessage = (
  messageDate: Date | string,
  transform: "uppercase" | "capitalize" = "capitalize"
) => {
  const _messageDate = dayjs(messageDate);
  const formatedDate = _messageDate.isSame(dayjs(), "day") // Is Today
    ? "Today"
    : _messageDate.isAfter(dayjs().subtract(7, "day"), "day") // Is less than 1 week
    ? _messageDate.format("dddd")
    : _messageDate.format("DD/MM/YYYY");
  return transform === "uppercase" ? formatedDate.toUpperCase() : formatedDate;
};
