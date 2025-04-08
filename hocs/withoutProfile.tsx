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
    const { me, isFetching } = useMe();
    const router = useRouter();

    useEffect(() => {
      if (!isFetching && !!me) {
        router.replace("/");
      }
    }, [me, isFetching, router]);

    if (isFetching || !!me) {
      return (
        <div className="w-screen h-screen flex items-center justify-center">
          <CircularProgress />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithoutProfile;
}
