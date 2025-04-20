import { Button, Typography } from "@mui/material";

interface InfoProps {
  title: string;
  description: string;
  actionText?: string;
  onActionClick?: () => void;
}

export default function Info({
  title,
  description,
  actionText,
  onActionClick,
}: InfoProps) {
  return (
    <>
      <div className="flex flex-col gap-3 items-center max-w-[300px]">
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography component="p" color="textSecondary" className="text-center">
          {description}
        </Typography>
        {!!actionText && onActionClick && (
          <div>
            <Button
              variant="contained"
              sx={{
                marginTop: 2,
              }}
              onClick={onActionClick}
            >
              {actionText}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
