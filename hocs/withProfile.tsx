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
    const { me, isFetching } = useMe();
    const router = useRouter();

    useEffect(() => {
      if (!isFetching && !me) {
        router.replace("/login");
      }
    }, [me, isFetching, router]);

    if (isFetching || !me) {
      return (
        <div className="w-screen h-screen flex items-center justify-center">
          <CircularProgress />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return ComponentWithProfile;
}
