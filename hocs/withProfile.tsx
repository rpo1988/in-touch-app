"use client";

import { useMe } from "@/providers/ProfileProvider";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { ComponentType, PropsWithChildren, useEffect } from "react";

type WithProfileProps = PropsWithChildren & React.JSX.IntrinsicAttributes;

export function withProfile<T extends WithProfileProps>(
  WrappedComponent: ComponentType<T>
) {
  const ComponentWithProfile: React.FC<T> = (props) => {
    const { me, initialized } = useMe();
    const router = useRouter();

    useEffect(() => {
      if (initialized && !me) {
        return router.replace("/login");
      }
    }, [initialized, me, router]);

    if (initialized && me) {
      return <WrappedComponent {...props} />;
    }

    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  };

  // Set a display name for better debugging
  ComponentWithProfile.displayName = `WithProfile(${
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    "ComponentWithProfile"
  })`;

  return ComponentWithProfile;
}
