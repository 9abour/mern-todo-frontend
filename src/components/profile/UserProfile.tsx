"use client";

import React, { useContext, useEffect, useState } from "react";
import { UserProfileWrapperStyled } from "./styles/index.styles";
import { useRouter } from "next/navigation";
import { UserContext } from "../../context/UserContext";
import { ITask } from "@/types/task.types";
import handleApiRequest from "@/helpers/handleApiRequest";
import UserTaskItem from "./UserTaskItem";
import Loader from "../common/Loader";
import { PageLoaderWrapper } from "@/styles/loading/loading.styles";

const Profile = () => {
	const [userCompletedTasks, setUserCompletedTasks] = useState<ITask[]>([]);
	const [userXP, setUserXP] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);

	const router = useRouter();
	const { user } = useContext(UserContext);

	useEffect(() => {
		if (user) {
			getUserTasks();
			getUserXP();
			setIsLoading(false);
		}

		setTimeout(() => {
			if (!user) {
				setIsLoading(false);
			}
		}, 2000);
	}, [user]);

	const getUserTasks = async () => {
		const data: { tasks: ITask[] } = await handleApiRequest({
			url: `${process.env.NEXT_PUBLIC_API_URL}/users/tasks/${user?._id}`,
			method: "GET",
		});

		const { tasks } = data;

		setUserCompletedTasks(tasks);
	};

	const getUserXP = async () => {
		const data: { totalUserXP: number } = await handleApiRequest({
			url: `${process.env.NEXT_PUBLIC_API_URL}/users/xp/${user?._id}`,
			method: "GET",
		});

		const { totalUserXP } = data;

		setUserXP(totalUserXP);
	};

	return user ? (
		<>
			<UserProfileWrapperStyled>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="80"
						height="80"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"
						/>
					</svg>
					<h2>{user?.name}</h2>
					<p>{user?.email}</p>

					<span>Your XP: {userXP}</span>

					<hr />

					{userCompletedTasks.length > 0 ? (
						<>
							<p>Your completed tasks</p>
							{userCompletedTasks.map(task => (
								<UserTaskItem key={task.name} task={task} />
							))}
						</>
					) : (
						<p>There is not tasks</p>
					)}

					<button onClick={() => router.back()}>Go back</button>
				</div>
			</UserProfileWrapperStyled>
		</>
	) : isLoading ? (
		<PageLoaderWrapper>
			<Loader />
		</PageLoaderWrapper>
	) : (
		<UserProfileWrapperStyled>
			<div>
				<p>You are not logged in.</p>
				<button onClick={() => router.push("/auth/login")}>Login</button>
			</div>
		</UserProfileWrapperStyled>
	);
};

export default Profile;
