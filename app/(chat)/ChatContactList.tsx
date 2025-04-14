"use client";

import ChatContactItem from "@/app/(chat)/ChatContactItem";
import ChatContactListSearcher from "@/app/(chat)/ChatContactListSearcher";
import Info from "@/app/(chat)/Info";
import { useMe } from "@/providers/ProfileProvider";
import { getContacts } from "@/services/user.service";
import { transform } from "@/utils/text";
import { ArrowBack } from "@mui/icons-material";
import {
  CircularProgress,
  Divider,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

interface ChatContactListProps {
  open: boolean;
  onClose: () => void;
  onSelected: (contactId: string) => void;
  onNewContact: () => void;
}

export default function ChatContactList({
  open,
  onClose,
  onSelected,
  onNewContact,
}: ChatContactListProps) {
  const { me } = useMe();
  const [contactSearchText, setContactSearchText] = useState<string>();
  const {
    data: contacts = [],
    isLoading,
    error,
  } = useQuery({
    enabled: !!me?._id,
    queryKey: ["contacts", me!._id],
    queryFn: () => getContacts(me!._id),
  });
  const filteredContacts = useMemo(() => {
    return !contactSearchText
      ? contacts
      : contacts.filter((contact) =>
          contact.name.toLowerCase().includes(contactSearchText.toLowerCase())
        );
  }, [contacts, contactSearchText]);

  const handleSearchContact = (text?: string) => {
    setContactSearchText(text);
  };

  useEffect(() => {
    if (!open) return;
    setContactSearchText("");
  }, [open]);

  return (
    <>
      <Toolbar className="flex flex-row gap-2.5">
        <IconButton edge="start" onClick={onClose}>
          <ArrowBack />
        </IconButton>
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
        <>
          <ChatContactListSearcher onTextSubmitted={handleSearchContact} />

          {!filteredContacts.length && (
            <div className="mt-8 px-4 flex justify-center">
              <Info
                title={transform("Contact not Found", "titlecase")}
                description="It seems that you don't have this contact yet. Add it to start a conversation with this person."
                actionText="Add contact"
                onActionClick={() => onNewContact()}
              />
            </div>
          )}

          <List>
            {filteredContacts.map((contact) => (
              <ChatContactItem
                key={contact._id}
                primary={contact.name}
                secondary={contact.statusInfo}
                onSelected={() => onSelected(contact._id)}
              />
            ))}
          </List>
        </>
      )}
    </>
  );
}
