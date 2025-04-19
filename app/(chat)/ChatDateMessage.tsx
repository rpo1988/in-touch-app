import { formatedDateMessage } from "@/utils/date";
import { Paper, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import clsx from "clsx";
import { forwardRef } from "react";

type ChatDateMessageProps = {
  date: Date | string;
};

export default forwardRef<HTMLDivElement, ChatDateMessageProps>(
  function ChatDateMessage({ date }, ref) {
    return (
      <>
        <Paper
          component="div"
          ref={ref}
          sx={{
            bgcolor: grey["50"],
          }}
          className={clsx("flex flex-col mx-4 my-1 p-2 self-center")}
        >
          <Typography variant="body1" fontSize={12}>
            {formatedDateMessage(date, "uppercase", false)}
          </Typography>
        </Paper>
      </>
    );
  }
);
