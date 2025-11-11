"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthContext } from "@/contexts/auth-context";
import api from "@/lib/api";
import { User, UserRole } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { getCookie } from "cookies-next";

type Props = {
  data: User[];
};

const UserTable: React.FC<Props> = ({ data }) => {
  const queryClient = useQueryClient();

  const { currentUser } = useAuthContext();

  const changeRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole }) => {
      // Assumption: backend exposes DELETE /users/:id to delete user
      const res = await api<User>(`/users/role`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${getCookie("ac-token")}`,
        },
        body: JSON.stringify({ role, id }),
      });
      return res.data;
    },

    onSuccess: (_, { id }) => {
      const user = data.find((u) => u.id === id);

      toast.success(`User ${user?.fullname} is now a ${user?.role}`);
    },

    onError: (err) => {
      toast.error(`Failed to delete user: ${(err as Error).message}`);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.fullname}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <div>
                <Select
                  defaultValue={user.role}
                  onValueChange={(value) => {
                    changeRole.mutate({ id: user.id, role: value as UserRole });
                  }}
                  disabled={user.id === currentUser?.id || changeRole.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UserRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <Button size="icon" variant="destructive">
                  <TrashIcon className="size-4" />
                  <span className="sr-only">Delete {user.fullname}</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
