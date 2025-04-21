import ChatContactList from "@/app/(chat)/ChatContactList";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";

interface ChatGroupCreationMembersProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (data: string[]) => void;
}

export default function ChatGroupCreationMembers({
  open,
  onCancel,
  onCreate,
}: ChatGroupCreationMembersProps) {
  const [selectedContactIds, setSelectedContactIds] = useState<
    Map<string, boolean>
  >(new Map());

  const handleSelected = (contactId: string) => {
    setSelectedContactIds((currentValue) => {
      currentValue.set(contactId, !currentValue.get(contactId));
      return new Map(currentValue);
    });
  };

  const handleCreate = () => {
    onCreate(
      selectedContactIds
        .entries()
        .toArray()
        .filter((item) => !!item[1])
        .map((item) => item[0])
    );
  };

  useEffect(() => {
    if (!open) return;
    setSelectedContactIds(new Map());
  }, [open]);

  return (
    <>
      <div className="flex flex-col gap-3">
        <ChatContactList
          open={open}
          selectable="multi"
          selectedIds={selectedContactIds}
          onSelected={handleSelected}
        />

        <div className="flex flex-col gap-3 px-4 lg:flex-row lg:self-end">
          <Button type="button" variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </div>
      </div>
    </>
  );
}
