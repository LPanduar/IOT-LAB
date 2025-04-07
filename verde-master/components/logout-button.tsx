"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleClick = async () => {
    await signOut({
      callbackUrl: "/login",
    });
  };

  return <Button className="bg-white text-black" onClick={handleClick}>Cerrar sesión</Button>;
};
export default LogoutButton;
