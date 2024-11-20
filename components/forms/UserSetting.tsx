"use client";
import { Github, LogOut, Mail, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePosts } from "@/context/AppContext";
import { useRouter } from "next/navigation";

const UserSetting = () => {
  const { user, logOut } = usePosts() ?? {};
  const router = useRouter();
  const handlesignout = async () => {
    try {
      await logOut?.();
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.photoURL as string | undefined} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-42 cursor-pointer">
        <DropdownMenuItem>
          <User />
          <span>{user?.displayName}</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Mail />
          <span>{user?.email}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Github />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handlesignout()}
        >
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserSetting;
