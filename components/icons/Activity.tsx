import type { SVGProps } from "react";
const Activity = (props: SVGProps<SVGSVGElement>) => (
	<svg
		fill="currentColor"
		viewBox="0 0 21 20"
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		{...props}
	>
		<path
			d="M8.00008 18.3332H13.0001C17.1667 18.3332 18.8334 16.6665 18.8334 12.4998V7.49984C18.8334 3.33317 17.1667 1.6665 13.0001 1.6665H8.00008C3.83341 1.6665 2.16675 3.33317 2.16675 7.49984V12.4998C2.16675 16.6665 3.83341 18.3332 8.00008 18.3332Z"
			stroke="#3D3D3D"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M6.6084 12.0748L8.59173 9.4998C8.87507 9.13314 9.40007 9.06647 9.76673 9.3498L11.2917 10.5498C11.6584 10.8331 12.1834 10.7665 12.4667 10.4081L14.3917 7.9248"
			stroke="#3D3D3D"
			strokeWidth={1.5}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);
export default Activity;
