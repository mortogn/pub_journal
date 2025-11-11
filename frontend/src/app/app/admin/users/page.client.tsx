"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuthContext } from "@/contexts/auth-context";
import api from "@/lib/api";
import { User, UserRole } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserTable from "./_components/user-table";
import { getCookie } from "cookies-next";

export default function UsersClientPage() {
  const queryClient = useQueryClient();
  const { data: { data: users } = {}, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return api<User[]>(`/users`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getCookie("ac-token")}`,
        },
      });
    },
  });

  const { currentUser } = useAuthContext();

  const changeRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: UserRole }) => {
      // Assumption: backend exposes PATCH /users/:id to update role
      const res = await api<User>(`/users/role`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${getCookie("ac-token")}`,
        },
        body: JSON.stringify({ role, id }),
      });
      return res.data;
    },
    // Optimistic update of users list
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const prev = queryClient.getQueryData<{ data: User[]; status: number }>([
        "users",
      ]);
      if (prev?.data) {
        const nextUsers = prev.data.map((u) =>
          u.id === vars.id ? { ...u, role: vars.role } : u
        );
        queryClient.setQueryData(["users"], { ...prev, data: nextUsers });
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["users"], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Spinner className="size-4" />
          <span>Loading Users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      {/* {users && users?.length > 0 ? (
        users.map((user) => (
          <div
            key={user.id}
            className="border border-border p-3 rounded-md shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-1">
                <h2 className="text-lg">
                  {user.fullname}

                  {user.id === currentUser?.id ? (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      You
                    </Badge>
                  ) : null}
                </h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="min-w-48 flex flex-col items-end gap-1">
                <label className="text-xs text-muted-foreground">Role</label>
                <Select
                  defaultValue={user.role}
                  onValueChange={(value) =>
                    changeRole.mutate({ id: user.id, role: value as UserRole })
                  }
                  disabled={user.id === currentUser?.id || changeRole.isPending}
                >
                  <SelectTrigger
                    size="sm"
                    aria-label={`Change role for ${user.fullname}`}
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {Object.values(UserRole).map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {changeRole.isPending && (
                  <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                    <Spinner className="size-3" />
                    Updating…
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No users found.</p>
      )} */}
      {users && <UserTable data={users} />}
    </div>
  );
}
