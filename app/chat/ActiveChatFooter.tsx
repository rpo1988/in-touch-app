import { Add, Mic } from "@mui/icons-material";
import { Divider, IconButton, TextField } from "@mui/material";

export default function ActiveChatFooter() {
  return (
    <>
      <Divider />
      <div className="bg-gray-50 flex flex-row py-2 px-4 gap-3 items-center">
        <IconButton>
          <Add />
        </IconButton>
        <TextField
          placeholder="Type a message"
          variant="outlined"
          className="grow"
          sx={{
            bgcolor: "white",
          }}
        />
        <IconButton>
          <Mic />
        </IconButton>
      </div>
    </>
  );
}
