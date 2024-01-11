"use client";

import React, { useEffect, useState } from "react";
import {
	CategoryListItems,
	CategoryListItemsWrapper,
	CategoryListWrapper,
} from "./styles/CategoryList.styles";
import { CategoryTitle } from "@/styles/typography/title.styles";
import CategoryCard from "./CategoryCard";
import handleApiRequest from "@/helpers/handleApiRequest";
import { ICategory } from "@/types/category.types";

const CategoryList = () => {
	const [categoriesListData, setCategoriesListData] = useState<ICategory[]>([]);

	useEffect(() => {
		(async () => {
			const data: ICategory[] = await handleApiRequest({
				url: "http://localhost:5000/categories",
				method: "GET",
			});

			setCategoriesListData(data);
		})();
	}, []);

	return (
		<CategoryListWrapper>
			{categoriesListData.length ? (
				<CategoryListItemsWrapper>
					<CategoryTitle>Categories</CategoryTitle>

					<CategoryListItems>
						{categoriesListData.map(category => (
							<CategoryCard key={category._id} category={category} />
						))}
					</CategoryListItems>
				</CategoryListItemsWrapper>
			) : (
				<h2>Loading...</h2>
			)}
		</CategoryListWrapper>
	);
};

export default CategoryList;
