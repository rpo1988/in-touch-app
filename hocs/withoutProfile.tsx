"use client";

import { useMe } from "@/providers/ProfileProvider";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { ComponentType, PropsWithChildren, useEffect } from "react";

type WithoutProfileProps = PropsWithChildren & React.JSX.IntrinsicAttributes;

export function withoutProfile<T extends WithoutProfileProps>(
  WrappedComponent: ComponentType<T>
) {
  const ComponentWithoutProfile: React.FC<T> = (props) => {
    const { me, initialized } = useMe();
    const router = useRouter();

    useEffect(() => {
      if (initialized && !!me) {
        return router.replace("/");
      }
    }, [me, initialized, router]);

    if (initialized && !me) {
      return <WrappedComponent {...props} />;
    }

    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  };

  // Set a display name for better debugging
  ComponentWithoutProfile.displayName = `WithoutProfile(${
    WrappedComponent.displayName ||
    WrappedComponent.name ||
    "ComponentWithoutProfile"
  })`;

  return ComponentWithoutProfile;
}
