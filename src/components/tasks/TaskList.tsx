import React, { useContext, useEffect, useState } from "react";
import {
	AddTaskButtonStyled,
	AddTaskInputStyled,
	AddTaskFormStyled,
	TasksListWrapperStyled,
	TasksWrapperStyled,
} from "./styles/index.styles";
import TaskListItem from "./TaskListItem";
import { TasksTitle } from "@/styles/typography/title.styles";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { UserContext } from "../../context/UserContext";
import Cookies from "js-cookie";
import { UIDataContext } from "../../context/UIDataContext";
import Loader from "../common/Loader";

const TaskList = () => {
	const { slug } = useParams();
	const { user } = useContext(UserContext);
	const uiDataContext = useContext(UIDataContext);
	const categoryTasks = uiDataContext?.categoryTasks;
	const categoryInfo = uiDataContext?.currentCategoryInfo;
	const [isLoading, setIsLoading] = useState(true);

	const token = Cookies.get("token");

	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!user || !token) {
			router.push("/auth/login");
			return;
		}

		if (!(e.target instanceof HTMLFormElement)) {
			return;
		}

		const formData = new FormData(e.target);
		const formElement = e.target;

		const newTask: any = {
			name: "",
			description: "",
			xp: 10,
			categories: [slug],
		};

		formData.forEach((value, key) => {
			newTask[key] = value.toString();
		});

		uiDataContext?.handleAddTask(newTask);

		formElement.reset();
	};

	useEffect(() => {
		if (!categoryTasks?.length) {
			setTimeout(() => {
				if (!categoryTasks?.length) {
					setIsLoading(false);
				}
			}, 2000);
		}
	}, [categoryTasks]);

	return (
		<TasksWrapperStyled>
			<Link href="/">/Home</Link>

			{categoryTasks?.length ? (
				<>
					<TasksTitle>{categoryInfo?.name + " Tasks"}</TasksTitle>
					<TasksListWrapperStyled>
						{categoryTasks.map(task => (
							<TaskListItem key={task.name} task={task} />
						))}
					</TasksListWrapperStyled>
				</>
			) : (
				isLoading && <Loader />
			)}
			<AddTaskFormStyled onSubmit={handleSubmit}>
				<AddTaskInputStyled
					name="name"
					type="text"
					placeholder="Name"
					required
				/>
				<AddTaskInputStyled
					name="description"
					type="text"
					placeholder="Description"
					required
				/>
				<AddTaskInputStyled name="xp" type="number" placeholder="XP" required />
				<AddTaskButtonStyled type="submit">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
					>
						<path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
					</svg>
				</AddTaskButtonStyled>
			</AddTaskFormStyled>
		</TasksWrapperStyled>
	);
};

export default TaskList;
