"use client";

import ChatContactItem from "@/app/(chat)/ChatContactItem";
import { useMe } from "@/providers/ProfileProvider";
import { getContacts } from "@/services/user.service";
import {
  CircularProgress,
  Divider,
  Drawer,
  List,
  Toolbar,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

interface ChatContactPanelProps {
  open: boolean;
  onClose: () => void;
  onSelected: (contactId: string) => void;
}

export default function ChatContactPanel({
  open,
  onClose,
  onSelected,
}: ChatContactPanelProps) {
  const { me } = useMe();
  const {
    data: contacts = [],
    isLoading,
    error,
  } = useQuery({
    enabled: !!me?._id,
    queryKey: ["contacts", me!._id],
    queryFn: () => getContacts(me!._id),
  });

  return (
    <>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <div className="w-[33vw] min-w-[300px]">
          <Toolbar className="flex flex-row justify-between">
            <Typography variant="h6" noWrap component="div">
              Contacts
            </Typography>
          </Toolbar>
          <Divider />
          {error ? (
            <div className="p-4">Error loading contacts</div>
          ) : isLoading ? (
            <div className="w-full p-4 flex items-center justify-center">
              <CircularProgress />
            </div>
          ) : (
            <List>
              {contacts.map((contact) => (
                <ChatContactItem
                  key={contact._id}
                  primary={contact.name}
                  secondary={contact.statusInfo}
                  onSelected={() => onSelected(contact._id)}
                />
              ))}
            </List>
          )}
        </div>
      </Drawer>
    </>
  );
}
