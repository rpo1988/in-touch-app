"use client";

import ChatContactItem from "@/app/(chat)/ChatContactItem";
import ChatContactListSearcher from "@/app/(chat)/ChatContactListSearcher";
import Info from "@/app/(chat)/Info";
import { useMe } from "@/providers/ProfileProvider";
import { getContacts } from "@/services/user.service";
import { transform } from "@/utils/text";
import { CircularProgress, List } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

interface ChatContactListProps {
  open: boolean;
  selectable?: false | "single" | "multi";
  selectedIds?: Map<string, boolean>;
  onSelected: (contactId: string) => void;
}

export default function ChatContactList({
  open,
  selectable = false,
  selectedIds = new Map(),
  onSelected,
}: ChatContactListProps) {
  const { me } = useMe();
  const [contactSearchText, setContactSearchText] = useState<string>();
  const {
    data: contacts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contacts", me!.id],
    queryFn: getContacts,
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
      {error ? (
        <div className="p-4">Error loading contacts</div>
      ) : isLoading ? (
        <div className="w-full p-4 flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : !contacts.length ? (
        <div className="mt-8 px-4 flex justify-center">
          <Info
            title={transform("No More Contacts", "titlecase")}
            description="It looks like there are no more contacts to add."
          />
        </div>
      ) : (
        <>
          <ChatContactListSearcher onTextSubmitted={handleSearchContact} />

          {!filteredContacts.length && (
            <div className="mt-8 px-4 flex justify-center">
              <Info
                title={transform("Contact Not Found", "titlecase")}
                description="It looks like this contact has not been registered yet. Please check your spelling to make sure it is correct or let them know so they can sign up and start chatting."
              />
            </div>
          )}

          <List>
            {filteredContacts.map((contact) => (
              <ChatContactItem
                key={contact.id}
                primary={contact.name}
                secondary={contact.statusInfo}
                selectable={selectable}
                selected={!!selectedIds.get(contact.id)}
                onSelected={() => onSelected(contact.id)}
              />
            ))}
          </List>
        </>
      )}
    </>
  );
}
