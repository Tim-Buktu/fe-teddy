import { createAuthClient } from "better-auth/react";

const { useSession } = createAuthClient();

export default function User() {
	const session = useSession();
}
